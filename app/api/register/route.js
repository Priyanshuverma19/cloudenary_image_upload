import connectDB from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, image } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      image, // Store the Cloudinary image URL
    });

    await user.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
