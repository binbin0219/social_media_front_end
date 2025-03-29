import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // const token = request.cookies.get('jwtToken')?.value;
    // if(!token) return NextResponse.redirect(new URL('/login', request.url));
    const response = NextResponse.next();
    return response;
}

export const config = {
    matcher: [`/((?!login|signup|signup/success|api|_next/static|_next/image|favicon.ico).*)`],
};