const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "armien.ab@gmail.com";
    const password = "admin123";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "admin",
        name: "Admin User",
        profileComplete: true,
      },
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
