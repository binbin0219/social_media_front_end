import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const cookie = serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/'
        });

        const res = NextResponse.redirect(new URL('/login', req.url));
        res.headers.set('Set-Cookie', cookie);
        return res;
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}