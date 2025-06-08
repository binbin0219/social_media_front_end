"use server"
import { cookies } from "next/headers";

export async function getCookie(cookieName: string) {
    const cookieStore = cookies();
    return (await cookieStore).get(cookieName);
}