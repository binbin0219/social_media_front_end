export const acceptFriendRequestOnServer = async (friendId: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/request/accept?friendId=${friendId}`, {credentials: 'include'});
    if(!response.ok) {
        throw new Error("Failed to accept friend request");
    }
    const data = await response.json();
    return data;
}

export const rejectFriendRequestOnServer = async (friendId: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/request/reject?friendId=${friendId}`, {credentials: 'include'});
    if(!response.ok) {
        throw new Error("Failed to reject friend request");
    }
    const data = await response.json();
    return data;
}