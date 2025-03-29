import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";
import { checkIfAccountNameExisted, createUserAvatar } from '@/lib/models/user';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const isAccountNameExisted = await checkIfAccountNameExisted(body.accountName.trim());
        if(isAccountNameExisted) return NextResponse.json({ error: 'Account name already existed' }, { status: 400 });

        const hashedPassword = await bcrypt.hash(String(body.Password), 10);
        const user = await prisma.user.create({
            data: {
                account_name: body.accountName.trim(),
                gender: body.Gender,
                username: body.Username.trim(),
                first_name: body.firstName.trim(),
                last_name: body.lastName.trim(),
                password: hashedPassword
            }
        });
        
        const genderString = body.Gender as string;
        const isGenderValid = genderString === 'male' || genderString === 'female' ? true : false;
        await createUserAvatar(user.id ,isGenderValid ? genderString as "male" | "female" : 'male');

        return NextResponse.json({ message: 'Successfully signed up' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}