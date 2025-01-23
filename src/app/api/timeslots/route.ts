import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to generate time slots for a given date
function generateTimeSlots(date: Date) {
  const timeSlots = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push({
        id: `${date.toISOString().split("T")[0]}-${time}`,
        date: date.toISOString().split("T")[0],
        time,
        available: true,
      });
    }
  }

  return timeSlots;
}

// GET /api/timeslots - Get available time slots for a specific date
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Check if the date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return NextResponse.json(
        { error: "Cannot book slots for past dates" },
        { status: 400 }
      );
    }

    // Generate all possible time slots for the date
    const timeSlots = generateTimeSlots(date);

    // Get existing bookings for the date
    const existingBookings = await prisma.booking.findMany({
      where: {
        preferredDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        status: "confirmed",
      },
      select: {
        preferredTime: true,
      },
    });

    // Mark booked slots as unavailable
    const bookedTimes = new Set(
      existingBookings.map((b: { preferredTime: string }) => b.preferredTime)
    );
    const availableTimeSlots = timeSlots.map((slot) => ({
      ...slot,
      available: !bookedTimes.has(slot.time),
    }));

    return NextResponse.json({ timeSlots: availableTimeSlots });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Error fetching time slots" },
      { status: 500 }
    );
  }
}
