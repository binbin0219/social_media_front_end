import { getBackendJwtToken } from "./auth";

export const apiAgent = {
    fetchOnClient,
    fetchOnServer
}

async function fetchOnClient(url: string, init?: RequestInit) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        credentials: "include",
        ...init
    });
}

async function fetchOnServer(url: string, init?: RequestInit) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...init,
        credentials: 'include',
        headers: {
            ...init?.headers,
            "Cookie": await getBackendJwtToken()
        },
    });
}