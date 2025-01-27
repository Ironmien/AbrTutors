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

    // Fetch all learners with their bookings
    const users = await prisma.user.findMany({
      where: {
        role: "user", // Only fetch regular users, not admins
      },
      select: {
        id: true,
        name: true,
        email: true,
        packageType: true,
        credits: true,
        bookings: {
          orderBy: {
            date: "desc",
          },
          select: {
            id: true,
            date: true,
            status: true,
            sessionType: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform and calculate additional stats for each learner
    const learners = users.map((user) => {
      const completedSessions = user.bookings.filter(
        (booking) => booking.status === "completed"
      ).length;

      const upcomingSessions = user.bookings.filter(
        (booking) =>
          booking.status === "pending" && new Date(booking.date) > new Date()
      ).length;

      // Calculate progress (example: based on completed sessions)
      // You might want to adjust this based on your specific requirements
      const progress = Math.min(
        Math.round((completedSessions / 20) * 100), // Assuming 20 sessions is 100%
        100
      );

      return {
        ...user,
        completedSessions,
        upcomingSessions,
        progress,
      };
    });

    return NextResponse.json({ learners });
  } catch (error) {
    console.error("Error fetching learners:", error);
    return NextResponse.json(
      { error: "Failed to fetch learners" },
      { status: 500 }
    );
  }
}
