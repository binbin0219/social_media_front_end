import { apiAgent } from "@/lib/api-agent";
import { Friend } from "@/lib/models/user";

const fetchFriends = async (userId: number, offset: number): Promise<Friend[]> => {
    const recordPerPage = 6;
    const response = await apiAgent.fetchOnClient(`/api/friendship/get/friends?userId=${userId}&offset=${offset}&recordPerPage=${recordPerPage}`);
    if(!response.ok) {
        throw new Error("Failed to fetch friends");
    }
    const data : {
        friends: Friend[]
    } = await response.json();
    return data.friends;
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