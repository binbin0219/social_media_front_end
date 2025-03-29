import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";
import { SignJWT } from 'jose';
import { serialize } from 'cookie';

export async function POST(req: Request) {
    try {
        const loginDetails = Object.fromEntries(await req.formData());
        const user = await prisma.user.findUnique({
            where: {
                account_name: String(loginDetails.accountName)
            }
        })
        if(!user) return NextResponse.json({ error: 'Account name or password is incorrect' }, { status: 404 });

        const isPasswordMatched = await bcrypt.compare(String(loginDetails.password), user.password);
        if(!isPasswordMatched) return NextResponse.json({ error: 'Account name or password is incorrect' }, { status: 401 });

        const token = await new SignJWT({ id: user.id })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60,
            path: '/'
        });

        return NextResponse.json({ token }, { status: 200, headers: { 'Set-Cookie': cookie } });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}