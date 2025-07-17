export type Friendship = {
    userId?: number | null,
    friendId?: number | null,
    status: FriendshipStatus,
    createAt?: string | null
}

export type FriendshipStatus = null | "PENDING" | "REJECTED" | "ACCEPTED"