export type Notification = {
    id: number;
    recipientId: number;
    senderId: number;
    senderUsername: string;
    senderUpdatedAt?: string;
    type: NotificationType;
    content: string;
    link: string;
    seen: boolean;
    targetId: number;
    createAt: string;
}

export enum NotificationType {
    LIKE = "LIKE",
    COMMENT = "COMMENT",
    FRIEND_REQUEST = "FRIEND_REQUEST",
}
