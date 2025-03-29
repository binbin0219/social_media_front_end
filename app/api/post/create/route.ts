import { verifyToken } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const token = (await cookies()).get('token')?.value;
        const verifiedUser = await verifyToken(token);
        if (!verifiedUser || !verifiedUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.formData();
        const title = body.get('title');
        const content = body.get('content');

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                title: String(title),
                content: String(content),
                user_id: (verifiedUser.id as number),
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Post created successfully', post: post }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
