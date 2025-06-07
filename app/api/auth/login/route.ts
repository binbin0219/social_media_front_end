import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
    });

    const response = NextResponse.json({status: backendRes.status});

    // Issue jwt token cookie from nextjs server
    const backendSetCookie = backendRes.headers.get('set-cookie');
    if(backendSetCookie) {
        // Example: SESSION=abc123; Path=/; HttpOnly; Secure; SameSite=None
        const parts = backendSetCookie.split(';');
        const [keyValue, ...rest] = parts;
        const [, value] = keyValue.split('=');
        const renamedCookie = `${process.env.NEXT_JWT_TOKEN_NAME}=${value}; ${rest.join(';')}`;

        response.headers.set('set-cookie', renamedCookie);
    }

    return response
}
