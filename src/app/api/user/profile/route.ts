import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
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
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        address,
        city,
        postcode,
        profileComplete: true,
      },
    });

    // Return the complete user object to update the session
    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        userType: updatedUser.userType,
        profileComplete: updatedUser.profileComplete,
        hasLearners: session.user.hasLearners,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        postcode: updatedUser.postcode,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
