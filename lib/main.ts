"use server"
import sharp from "sharp";
import { getUserDataById, User } from "./models/user";
import { cookies } from "next/headers";
import { Post } from "./models/post";

export async function getAuthUserDataFromHeader(headers: () => Promise<Headers>) {
    const userHeader = (await headers()).get("x-user");
    const user = userHeader ? JSON.parse(userHeader) : null;
    const userId = user ? user.id : null;
    if(!userId) return null;
    const authUserData = await getUserDataById(userId);
    if(!authUserData) return null;
    return authUserData
}

export async function convertSvgToPngBuffer(svg: string) {
    return await sharp(Buffer.from(svg)).png().toBuffer();
}

export async function getCsrfFromServer() : Promise<string> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/csrf-token`);
    const data = await response.json();
    return data.csrfToken;
}

async function getJwtCookie() {
    const cookieName = 'jwtToken';
    const cookieStore = cookies();
    const jwtCookie = (await cookieStore).get(cookieName);
    return jwtCookie ? `${cookieName}=${jwtCookie.value}` : null;
}

export async function fetchProfileUserFromServer (userId: number) : Promise<{user: User; posts: Post[]} | null> {
    const jwtCookie = await getJwtCookie();
    if(jwtCookie === null) {
        return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/get`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "Cookie": jwtCookie
        },
        credentials: 'include',
        body: JSON.stringify({
            userId: userId
        })
    });
    if(!response.ok) throw new Error("Failed to fetch user data: " + userId);
    const data = await response.json();
    const user = data.user;
    const posts = data.posts;
    return { user , posts};
}