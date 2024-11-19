import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const { file } = await req.json(); // Base64 or file URL
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "users",
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
