import { apiAgent } from "@/lib/api-agent";
import { ChatRoom, ChatRoomType } from "@/lib/models/ChatRoom";
import { ChatMessage } from "../models/ChatMessage";

const fetchChatRooms = async (offset: number, recordPerPage: number): Promise<ChatRoom[]> => {
    const response = await apiAgent.fetchOnClient(`/api/chatroom/get?offset=${offset}&recordPerPage=${recordPerPage}`);
    if(!response.ok) {
        throw new Error("Failed to fetch chat rooms");
    }
    const data : {
        chatRooms: ChatRoom[]
    } = await response.json();
    return data.chatRooms;
}

const initPrivateChatOnServer = async (requestBody: {
    peerId: number,
    text: string
}) => {
    const response = await apiAgent.fetchOnClient(`/api/chatroom/private/init`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    if(!response.ok) {
        throw new Error("Failed to init private chat on server");
    }
    const data = await response.json();
    return data.chatRoom as ChatRoom;
}

const sendPrivateMessageOnServer = async (requestBody: {
    peerId: number,
    text: string
}) => {
    const response = await apiAgent.fetchOnClient(`/api/chatroom/private/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    if(!response.ok) {
        throw new Error("Failed to send private message on server");
    }
    const data = await response.json();
    return {
        message: data.message as ChatMessage,
        messagePreview: data.messagePreview as string,
        lastMessageAt: data.lastMessageAt as string
    }
}

function getPeerFromPrivateChatRoom(chatRoom: ChatRoom, meId: number) {
    if(chatRoom.type !== ChatRoomType.PRIVATE) {
        throw new Error("Failed to get peer from private chat room: Chat room is not type of private");
    }

    return chatRoom.members.filter(member => member.userId !== meId)[0];
}

const fetchChatMessages = async (chatRoomId: string, offset: number, recordPerPage: number): Promise<ChatMessage[]> => {
    const response = await apiAgent.fetchOnClient(`/api/chatmessage/get?offset=${offset}&recordPerPage=${recordPerPage}&chatRoomId=${chatRoomId}`);
    if(!response.ok) {
        throw new Error("Failed to fetch chat messages");
    }
    const data : {
        chatMessages: ChatMessage[]
    } = await response.json();
    return data.chatMessages;
}

const fetchPrivateChatRoom = async (userId: number) => {
    const response = await apiAgent.fetchOnClient(`/api/chatroom/private/get?userId=${userId}`);
    if(!response.ok) {
        throw new Error("Failed to fetch private chat room");
    }
    const data: {chatRoom: ChatRoom} = await response.json();
    return data.chatRoom as ChatRoom;
}

export const chatService = {
    fetchChatRooms,
    fetchChatMessages,
    fetchPrivateChatRoom,
    initPrivateChatOnServer,
    sendPrivateMessageOnServer,
    getPeerFromPrivateChatRoom,
}