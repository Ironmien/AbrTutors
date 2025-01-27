import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { bookingId } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["completed", "cancelled", "no-show"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status provided" },
        { status: 400 }
      );
    }

    // Get the booking and associated user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Start a transaction to update booking status and handle credits
    const result = await prisma.$transaction(async (tx) => {
      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status },
      });

      // If marking as completed, deduct one credit
      if (status === "completed" && booking.status !== "completed") {
        await tx.user.update({
          where: { email: booking.userEmail },
          data: {
            credits: {
              decrement: 1,
            },
          },
        });

        // Create credit history record
        await tx.creditHistory.create({
          data: {
            userId: booking.user.id,
            amount: -1,
            category: "session",
            reason: `Credit deducted for completed session on ${
              booking.date.toISOString().split("T")[0]
            }`,
            type: "DEBIT",
            adminId: null,
          },
        });
      }

      return updatedBooking;
    });

    return NextResponse.json({
      message: "Booking status updated successfully",
      booking: result,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
