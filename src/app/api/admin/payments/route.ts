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

    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all payments with user information
    const payments = await prisma.payment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Calculate statistics
    const stats = {
      totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
      monthlyRevenue: payments
        .filter((payment) => new Date(payment.createdAt) >= firstDayOfMonth)
        .reduce((sum, payment) => sum + payment.amount, 0),
      successfulPayments: payments.filter(
        (payment) => payment.status === "completed"
      ).length,
      pendingPayments: payments.filter(
        (payment) => payment.status === "pending"
      ).length,
      averagePayment:
        payments.length > 0
          ? payments.reduce((sum, payment) => sum + payment.amount, 0) /
            payments.length
          : 0,
      activeUsers: new Set(payments.map((payment) => payment.userEmail)).size,
    };

    return NextResponse.json({ payments, stats });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
