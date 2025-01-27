import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16];
const MAX_SLOTS_PER_HOUR = 4;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    // Get all bookings for the specified date
    const bookings = await prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { not: "cancelled" },
      },
      select: {
        hour: true,
        slotNumber: true,
      },
    });

    // Count bookings per hour
    const bookingsPerHour: { [key: number]: number } = {};
    bookings.forEach((booking) => {
      bookingsPerHour[booking.hour] = (bookingsPerHour[booking.hour] || 0) + 1;
    });

    // Calculate available slots for each hour
    const slots = HOURS.map((hour) => ({
      hour,
      availableSlots: MAX_SLOTS_PER_HOUR - (bookingsPerHour[hour] || 0),
    }));

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Error fetching availability" },
      { status: 500 }
    );
  }
}
