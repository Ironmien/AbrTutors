import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Resend } from "resend";
import { getBookingStatusUpdateEmail } from "@/lib/email-templates";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { status } = await request.json();

    // Fetch the booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        user: true,
        learner: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user is admin or the booking owner
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== "admin" && booking.userEmail !== user.email)) {
      return NextResponse.json(
        { error: "Not authorized to update this booking" },
        { status: 403 }
      );
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: { status },
      include: {
        user: true,
        learner: true,
      },
    });

    // Send email notification
    if (updatedBooking.user.email) {
      const emailData = {
        parentName: updatedBooking.user.name || "Parent",
        learnerName: updatedBooking.learner?.name || updatedBooking.studentName,
        date: updatedBooking.date,
        hour: updatedBooking.hour,
        package: updatedBooking.package,
        sessionType: updatedBooking.sessionType,
        status: updatedBooking.status,
      };

      const { subject, html } = getBookingStatusUpdateEmail(emailData);

      await resend.emails.send({
        from: "AbrTutors <noreply@abrtutors.com>",
        to: updatedBooking.user.email,
        subject,
        html,
      });
    }

    return NextResponse.json({
      booking: updatedBooking,
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
