import { NextRequest, NextResponse } from "next/server";
import { getVisitorTotal, trackVisitor } from "@/lib/visitor-counter";

const VISITOR_COOKIE = "sudharaka-portfolio-visitor";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const dynamic = "force-dynamic";

export async function GET() {
  const totalVisitors = await getVisitorTotal();
  return NextResponse.json({ totalVisitors });
}

export async function POST(request: NextRequest) {
  const hasVisitedBefore = request.cookies.has(VISITOR_COOKIE);
  const totalVisitors = await trackVisitor(hasVisitedBefore);
  const response = NextResponse.json({ totalVisitors });

  if (!hasVisitedBefore) {
    response.cookies.set({
      name: VISITOR_COOKIE,
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}
