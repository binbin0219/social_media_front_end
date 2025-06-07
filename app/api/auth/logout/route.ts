import { NextResponse } from "next/server";

export async function POST() {
    const res = new NextResponse(
        JSON.stringify({ message: 'Logged out successfully' }),
        { status: 200 }
    );

    res.headers.set(
        'Set-Cookie',
        `${process.env.NEXT_JWT_TOKEN_NAME}=; Path=/; Max-Age=0;`
    );

    return res;
}