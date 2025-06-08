import { getBackendJwtToken } from "@/lib/auth";
import { Post } from "@/lib/models/post";
import { User } from "@/lib/models/user";
import { apiAgent } from "../api-agent";

async function fetchProfileUserFromServer (userId: number) : Promise<{user: User; posts: Post[]} | null> {
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

const fetchUsersByUsername = async (username: string, offset: number, recordPerPage: number): Promise<User[]> => {
    const response = await apiAgent.fetchOnClient(`/api/user/search?offset=${offset}&recordPerPage=${recordPerPage}&username=${username}`);
    if(!response.ok) {
        throw new Error("Failed to fetch users by username");
    }
    const data : {
        searchResults: User[]
    } = await response.json();
    return data.searchResults;
}

export const userService = {
    fetchProfileUserFromServer,
    fetchUsersByUsername
}