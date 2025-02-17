"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient, Prisma } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendBookingCancellationEmail,
} from "@/lib/email";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

type PackageType = "single" | "standard" | "premium";

const PACKAGE_CREDITS: Record<PackageType, number> = {
  single: 1,
  standard: 4,
  premium: 8,
};

// GET /api/bookings - Get all bookings for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const learnerId = searchParams.get("learnerId");

    const whereClause: Prisma.BookingWhereInput = {
      userEmail: session.user.email,
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (learnerId) {
      whereClause.learnerId = learnerId;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        learner: true,
        user: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error fetching bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      date,
      hour,
      slotNumber,
      learnerId,
      package: packageType,
      sessionType,
    } = await req.json();

    // Validate required fields
    if (
      !date ||
      !hour ||
      !slotNumber ||
      !learnerId ||
      !packageType ||
      !sessionType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the learner and verify ownership
    const learner = await prisma.learner.findUnique({
      where: { id: learnerId },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });

    if (!learner) {
      return NextResponse.json({ error: "Learner not found" }, { status: 404 });
    }

    // Check if user is authorized to book for this learner
    if (learner.parentId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to book for this learner" },
        { status: 403 }
      );
    }

    // Check if slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        hour: hour,
        slotNumber: slotNumber,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This slot is already booked" },
        { status: 400 }
      );
    }

    // Calculate credits needed based on package
    const creditsNeeded = PACKAGE_CREDITS[packageType as PackageType] || 0;

    // Check if user has enough credits
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { credits: true },
    });

    if (!user || user.credits < creditsNeeded) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // Create booking and deduct credits in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          date: new Date(date),
          hour,
          slotNumber,
          package: packageType,
          sessionType,
          studentName: learner.name,
          learner: { connect: { id: learnerId } },
          user: { connect: { email: userEmail } },
          status: "confirmed",
        },
      });

      // Deduct credits
      await tx.user.update({
        where: { email: userEmail },
        data: { credits: { decrement: creditsNeeded } },
      });

      // Create credit history entry
      await tx.creditHistory.create({
        data: {
          userId,
          amount: -creditsNeeded,
          type: "debit",
          category: "booking",
          reason: `Booking for ${packageType} package`,
        },
      });

      return newBooking;
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/:id - Update a booking status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized to modify this booking" },
        { status: 403 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    // Send status update email
    await sendBookingStatusUpdateEmail(session.user.email, updatedBooking);

    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Error updating booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/:id - Cancel a booking
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized to cancel this booking" },
        { status: 403 }
      );
    }

    // Send cancellation email before deleting the booking
    await sendBookingCancellationEmail(session.user.email, booking);

    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Error cancelling booking" },
      { status: 500 }
    );
  }
}
