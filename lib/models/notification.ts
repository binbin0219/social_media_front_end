export type Notification = {
    id: number;
    recipientId: number;
    senderId: number;
    senderAvatar: string;
    senderFirstName: string;
    senderLastName: string;
    type: NotificationType;
    content: string;
    link: string;
    seen: boolean;
    createAt: string;
}

export type NotificationType = "like" | "comment" | "FRIEND_REQUEST";