import { ChatMessage } from "./ChatMessage";
import { ChatRoomMember } from "./ChatRoomMember";

export type ChatRoom = {
    id: string;
    name: string | null;
    type: ChatRoomType;
    messagePreview: string | null;
    lastMessageAt: string | null;
    isTemp: boolean;
    members: ChatRoomMember[];
    messages: ChatMessage[] | null
    unreadCount: number;
    isAllMessagesLoaded?: boolean;
}

export type UnreadMessageCount = {
    chatRoomId: string;
    unreadCount: number;
}

export enum ChatRoomType {
    PRIVATE = "PRIVATE",
    GROUP = "GROUP"
}