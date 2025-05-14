import { ChatAttactment } from "./ChatAttachment";

export type ChatMessage = {
    id: string;
    senderId: number;
    senderUsername: string;
    text: string;
    attachments: ChatAttactment[]
    createAt: string;
}