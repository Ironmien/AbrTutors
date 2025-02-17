import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type BlockedDate = {
  id: string;
  date: Date;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blockedDates = await prisma.$queryRaw`
      SELECT * FROM "BlockedDate" ORDER BY date ASC
    `;

    return NextResponse.json({
      blockedDates: (blockedDates as BlockedDate[]).map((bd) =>
        bd.date.toISOString()
      ),
    });
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { date, reason } = await request.json();

    const blockedDate = await prisma.$queryRaw`
      INSERT INTO "BlockedDate" (id, date, reason, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${new Date(date)}, ${reason}, NOW(), NOW())
      RETURNING *
    `;

    return NextResponse.json(blockedDate);
  } catch (error) {
    console.error("Error blocking date:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { date } = await request.json();

    await prisma.$executeRaw`
      DELETE FROM "BlockedDate"
      WHERE date = ${new Date(date)}
    `;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error unblocking date:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
