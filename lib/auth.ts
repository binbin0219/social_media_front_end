import { jwtVerify } from "jose";

export async function verifyToken(token: string | undefined) {
    try {
        if(!token) return null;
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return payload
    } catch (error) {
        return null
    }
}
