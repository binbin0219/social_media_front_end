"use server"
import { User } from "./models/user";
import { Post } from "./models/post";
import { getBackendJwtToken } from "@/js/auth";

export async function fetchProfileUserFromServer (userId: number) : Promise<{user: User; posts: Post[]} | null> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/get`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "Cookie": await getBackendJwtToken()
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