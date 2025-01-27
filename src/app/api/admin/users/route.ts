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

    // Fetch all users with their bookings and payments
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
          take: 5, // Get only the 5 most recent bookings
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Get only the 5 most recent payments
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
