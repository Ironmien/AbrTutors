import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/learners - Create a new learner
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to add a learner" },
        { status: 401 }
      );
    }

    const { name, dateOfBirth, schoolYear, subjects } = await request.json();

    // Validate required fields
    if (!name || !dateOfBirth || !schoolYear || !subjects?.length) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create the learner with proper typing
    const learnerData: Prisma.LearnerCreateInput = {
      name: name,
      dateOfBirth: new Date(dateOfBirth),
      schoolYear: parseInt(schoolYear.toString()),
      subjects: subjects,
      isAdult: session.user.userType === "independent_learner",
      parent: {
        connect: {
          id: session.user.id,
        },
      },
    };

    const learner = await prisma.learner.create({
      data: learnerData,
    });

    // Update user's profile to mark that they have learners
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        profileComplete: true,
      },
    });

    return NextResponse.json({
      learner,
      message: "Learner added successfully",
    });
  } catch (error) {
    console.error("Error adding learner:", error);
    return NextResponse.json(
      { error: "Failed to add learner" },
      { status: 500 }
    );
  }
}

// GET /api/learners - Get all learners for the current parent
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view learners" },
        { status: 401 }
      );
    }

    const learners = await prisma.learner.findMany({
      where: {
        parentId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(learners);
  } catch (error) {
    console.error("Error fetching learners:", error);
    return NextResponse.json(
      { error: "Failed to fetch learners" },
      { status: 500 }
    );
  }
}
