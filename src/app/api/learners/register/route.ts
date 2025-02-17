import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to register learners" },
        { status: 401 }
      );
    }

    const { learners } = await req.json();

    if (!Array.isArray(learners) || learners.length === 0) {
      return NextResponse.json(
        { error: "At least one learner is required" },
        { status: 400 }
      );
    }

    // Get the parent user
    const parent = await db.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent user not found" },
        { status: 404 }
      );
    }

    if (parent.userType !== UserType.parent) {
      return NextResponse.json(
        { error: "Only parents can register learners" },
        { status: 403 }
      );
    }

    // Create learners
    const createdLearners = await Promise.all(
      learners.map((learner) =>
        db.learner.create({
          data: {
            name: learner.name,
            dateOfBirth: new Date(learner.dateOfBirth),
            schoolYear: parseInt(learner.grade),
            parentId: parent.id,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: "Learners registered successfully",
        learners: createdLearners,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering learners:", error);
    return NextResponse.json(
      { error: "Error registering learners" },
      { status: 500 }
    );
  }
}
