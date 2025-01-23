import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";
import {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
  sendBookingCancellationEmail,
} from "@/lib/email";

const prisma = new PrismaClient();

// GET /api/bookings - Get all bookings for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userEmail: session.user.email,
      },
      orderBy: {
        preferredDate: "asc",
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
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      package: tutorPackage,
      sessionType,
      preferredDate,
      preferredTime,
    } = body;

    if (!tutorPackage || !sessionType || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the time slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        preferredDate: new Date(preferredDate),
        preferredTime: preferredTime,
        status: "confirmed",
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        package: tutorPackage,
        sessionType,
        preferredDate: new Date(preferredDate),
        preferredTime,
        status: "pending",
        userEmail: session.user.email,
        studentName: session.user.name || "Unknown",
      },
    });

    // Send confirmation email
    await sendBookingConfirmationEmail(session.user.email, booking);

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Error creating booking" },
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
