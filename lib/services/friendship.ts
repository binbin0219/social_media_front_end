import { apiAgent } from "@/lib/api-agent";
import { Friend } from "@/lib/models/user";

const fetchFriends = async (userId: number, start: number): Promise<Friend[]> => {
    const length = 6;
    const response = await apiAgent.fetchOnClient(`/api/friendship/${userId}/friends?userId=${userId}&start=${start}&length=${length}`);
    if(!response.ok) {
        throw new Error("Failed to fetch friends");
    }
    const data : {
        data: Friend[]
    } = await response.json();
    return data.data;
}

const sendFriendRequestOnServer = async (friendId: number) => {
    const response = await apiAgent.fetchOnClient(`/api/friendship/request/send?friendId=${friendId}`);
    if(!response.ok) {
        throw new Error("Failed to send friend request");
    }
    return await response.json();
}

const acceptFriendRequestOnServer = async (friendId: number) => {
    const response = await apiAgent.fetchOnClient(`/api/friendship/request/accept?friendId=${friendId}`);
    if(!response.ok) {
        throw new Error("Failed to accept friend request");
    }
    const data = await response.json();
    return data;
}

const rejectFriendRequestOnServer = async (friendId: number) => {
    const response = await apiAgent.fetchOnClient(`/api/friendship/request/reject?friendId=${friendId}`);
    if(!response.ok) {
        throw new Error("Failed to reject friend request");
    }
    const data = await response.json();
    return data;
}

export const friendshipService = {
    fetchFriends,
    sendFriendRequestOnServer,
    acceptFriendRequestOnServer,
    rejectFriendRequestOnServer
}