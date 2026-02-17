import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const role = req.cookies.get("role")?.value;

    if (req.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};
