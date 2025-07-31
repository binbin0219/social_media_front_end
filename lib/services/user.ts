import { getBackendJwtToken } from "@/lib/auth";
import { Post } from "@/lib/models/post";
import { User, RecommendedUsers } from "@/lib/models/user";
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

async function getRecommendations(limit: number): Promise<RecommendedUsers[]> {
    const response = await apiAgent.fetchOnClient(`/api/user/recommendations?limit=${limit}`);
    if(!response.ok) {
        throw new Error("Failed to fetch user recommendations");
    }
    const userRecommendations: RecommendedUsers[] = await response.json();
    return userRecommendations;
}

export const updateUserProfileOnServer = async (newProfile: Partial<User>) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...newProfile
        })
    });
    if (!response.ok) {
        throw new Error("Failed to update user data on server");
    }
}

export function getUserAvatarLink(userId: number, updatedAt?: string) {
    const baseAvatarUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/user/${userId}/avatar/avatar.png`;
    return updatedAt ? `${baseAvatarUrl}?${new Date(updatedAt).getTime()}` : baseAvatarUrl;
}

export function getUserCoverLink(userId: number, updatedAt?: string) {
    const baseAvatarUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/user/${userId}/cover/cover.png`;
    return updatedAt ? `${baseAvatarUrl}?${new Date(updatedAt).getTime()}` : baseAvatarUrl;
}

export const userService = {
    fetchProfileUserFromServer,
    fetchUsersByUsername,
    getRecommendations
}