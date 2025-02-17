import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bookings = await prisma.booking.groupBy({
      by: ["date", "hour"],
      _count: {
        id: true,
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      date: booking.date.toISOString().split("T")[0],
      startTime: booking.hour,
      bookings: booking._count.id,
    }));

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
