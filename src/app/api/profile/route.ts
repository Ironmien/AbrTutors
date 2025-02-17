import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to update your profile" },
        { status: 401 }
      );
    }

    const { name, phone, address, city, postcode } = await request.json();

    // Validate required fields
    if (!name || !phone || !address || !city || !postcode) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
        address,
        city,
        postcode,
        profileComplete: true,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postcode: user.postcode,
        profileComplete: user.profileComplete,
        userType: user.userType,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
