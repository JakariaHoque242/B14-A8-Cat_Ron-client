import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "booknook_jwt_super_secret_key_2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, id } = body;

    if (!email) {
      return NextResponse.json({ error: true, message: "Email is required" }, { status: 400 });
    }

    const token = jwt.sign(
      { email, name: name || "Reader", id: id || email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    return NextResponse.json({ error: true, message: error.message || "Failed to generate token" }, { status: 500 });
  }
}
