import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CustomSession {
  id: string;
  date: Date;
  startTime: number;
  endTime: number;
  maxSlots: number;
  reason?: string | null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const customSessions = await prisma.$queryRaw`
      SELECT * FROM "CustomSessionTime" ORDER BY date ASC
    `;

    return NextResponse.json({ customSessions });
  } catch (error) {
    console.error("Error fetching custom sessions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { date, startTime, endTime, maxSlots, reason } = await request.json();

    const customSession = await prisma.$executeRaw`
      INSERT INTO "CustomSessionTime" (
        id, 
        date, 
        "startTime", 
        "endTime", 
        "maxSlots", 
        reason, 
        "createdAt", 
        "updatedAt"
      )
      VALUES (
        gen_random_uuid(), 
        ${new Date(date)}, 
        ${startTime}, 
        ${endTime}, 
        ${maxSlots}, 
        ${reason}, 
        NOW(), 
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(customSession);
  } catch (error) {
    console.error("Error creating custom session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await request.json();

    await prisma.$executeRaw`
      DELETE FROM "CustomSessionTime"
      WHERE id = ${id}
    `;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting custom session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
