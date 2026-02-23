import bcrypt from "bcryptjs";
import { connectDb } from "../config/db";
import { Todo } from "../models/Todo";
import { User } from "../models/User";

const run = async (): Promise<void> => {
  await connectDb();

  const email = process.env.SEED_USER_EMAIL ?? "user@example.com";
  const password = process.env.SEED_USER_PASSWORD ?? "User@12345";

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: "Sample User",
      email,
      password: await bcrypt.hash(password, 12)
    });
  }

  const count = await Todo.countDocuments({ user: user._id, deletedAt: null });
  if (count === 0) {
    await Todo.insertMany([
      {
        user: user._id,
        title: "Ship production todo app",
        description: "Complete backend and frontend",
        priority: "high",
        tags: ["release", "engineering"],
        dueDate: new Date(Date.now() + 86400000),
        position: 0
      },
      {
        user: user._id,
        title: "Review monitoring",
        priority: "medium",
        tags: ["ops"],
        position: 1
      }
    ]);
  }

  console.log("Seed completed");
  process.exit(0);
};

void run();
