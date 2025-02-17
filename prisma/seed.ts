import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("admin123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "armien.ab@gmail.com",
      name: "Armien",
      password: hashedPassword,
      role: "admin",
      availableSessions: 0,
      profileComplete: true,
    },
  });

  console.log("Created admin user:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
