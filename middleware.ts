import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getFrontEndJwtCookie, verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
    const jwtCookie = await getFrontEndJwtCookie();
    if(!jwtCookie || !verifyToken(jwtCookie.value)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    const response = NextResponse.next();
    return response;
}

export const config = {
    matcher: [
        `/((?!login|signup|signup/success|api|_next/static|_next/image|favicon.ico|assets).*)`
    ]
};