import { NextResponse } from "next/server";
import {
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 },
      );
    }

    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Admin login could not be completed." },
      { status: 500 },
    );
  }
}
