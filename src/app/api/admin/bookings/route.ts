import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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

    // Get date from query parameters
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Fetch bookings for the specified date
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: date,
          lt: nextDay,
        },
      },
      orderBy: [{ hour: "asc" }, { slotNumber: "asc" }],
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform the data to match the frontend requirements
    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      date: booking.date.toISOString(),
      hour: booking.hour,
      slotNumber: booking.slotNumber,
      studentName: booking.user.name || "No name",
      package: booking.package,
      sessionType: booking.sessionType,
      status: booking.status,
      userEmail: booking.user.email,
    }));

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
