import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Available hours (9 AM to 5 PM)
const AVAILABLE_HOURS = Array.from({ length: 9 }, (_, i) => i + 9);
const MAX_SLOTS_PER_HOUR = 4;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Set to start of day
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get all bookings for the specified date
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDay,
        },
        status: {
          not: "cancelled",
        },
      },
    });

    // Count bookings per hour
    const bookingsPerHour = bookings.reduce((acc, booking) => {
      if (booking.hour) {
        acc[booking.hour] = (acc[booking.hour] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Calculate available slots for each hour
    const availability = AVAILABLE_HOURS.map((hour) => {
      const bookedSlots = bookingsPerHour[hour] || 0;
      const availableSlots = MAX_SLOTS_PER_HOUR - bookedSlots;

      // Get booked slot numbers for this hour
      const bookedSlotNumbers = bookings
        .filter((b) => b.hour === hour)
        .map((b) => b.slotNumber);

      // Calculate available slot numbers (1-4)
      const availableSlotNumbers = Array.from(
        { length: MAX_SLOTS_PER_HOUR },
        (_, i) => i + 1
      ).filter((num) => !bookedSlotNumbers.includes(num));

      return {
        hour,
        availableSlots,
        availableSlotNumbers,
      };
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
