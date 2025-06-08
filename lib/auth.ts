import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { jwtVerify } from "jose";
import { getCookie } from "./utils/server";

export async function getFrontEndJwtCookie() {
    return await getCookie(process.env.NEXT_JWT_TOKEN_NAME!) as RequestCookie;
}

export async function getBackendJwtToken() {
    const jwtCookie = await getFrontEndJwtCookie();
    return `${process.env.JWT_TOKEN_NAME}=${jwtCookie.value}`;
}

export async function verifyToken(token: string | undefined) {
    try {
        if(!token) return null;
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return payload
    } catch (error) {
        console.log(error);
        return null
    }
}

async function logoutOnBackend() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,{
        method: 'POST',
        credentials: 'include'
    });
    if(!response) {
        throw new Error("Failed to log out on backend");
    }
}

async function logoutOnFrontEnd() {
    const response = await fetch(`/api/auth/logout`,{
        method: 'POST',
        credentials: 'include'
    });
    if(!response) {
        throw new Error("Failed to log out on backend");
    }
}

export async function logout() {
    await logoutOnBackend();
    await logoutOnFrontEnd();
    window.location.href = '/';
}