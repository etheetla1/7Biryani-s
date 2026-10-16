import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get("ifrw_vid")) {
    const id = crypto.randomUUID();
    res.cookies.set("ifrw_vid", id, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  if (process.env.NEXT_PUBLIC_NOINDEX === "1") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"] };
