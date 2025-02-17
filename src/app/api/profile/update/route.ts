import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postcode: data.postcode,
        profileComplete: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
