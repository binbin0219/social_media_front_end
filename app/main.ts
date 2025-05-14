import { ChatMessage } from "@/lib/models/ChatMessage";
import { ChatRoom, ChatRoomType } from "@/lib/models/ChatRoom";
import { NotificationType } from "@/lib/models/notification";
import { Friend } from "@/lib/models/user";

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

export const deleteNotificationOnServer = async (notificationId: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notification/delete`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            notificationId
        })
    });
    if(!response.ok) {
        throw new Error("Failed to reject friend request");
    }
    const data = await response.json();
    return data;
}

export function disableSpaceInputOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ' ') {
        e.preventDefault();
    }
}

export function disableSpaceInputOnPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    if(e.clipboardData) {
        const pastedText = e.clipboardData.getData('text');
        if (pastedText.includes(' ')) {
            e.preventDefault();
        }
    }
}

export function checkIsEmpty(value: string): boolean {
    return value.trim() === "";
}

export function checkIsOnlyCharacter(value: string): boolean {
    const regex = /^[A-Za-z]+$/;
    return regex.test(value);
}

export function checkIsOnlyCharacterAndNumber(value: string): boolean {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(value);
}

export function checkIsValidInputLength(value: string, min: number, max: number): boolean {
    const length = value.trim().length;
    return length >= min && length <= max;
}

export function checkIsBase64Image(str: string): boolean {
    if (typeof str !== 'string') return false;

    const regex = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/]+={0,2}$/;

    if (!regex.test(str)) return false;

    try {
        const base64Data = str.split(',')[1];
        atob(base64Data); // Try decoding to validate
        return true;
    } catch {
        return false;
    }
}

export const fetchFriends = async (offset: number): Promise<Friend[]> => {
    const recordPerPage = 6;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/get/friends?offset=${offset}&recordPerPage=${recordPerPage}`, {
        credentials: 'include'
    });
    if(!response.ok) {
        throw new Error("Failed to fetch friends");
    }
    const data : {
        friends: Friend[]
    } = await response.json();
    return data.friends;
}

export function getPeerFromPrivateChatRoom(chatRoom: ChatRoom, meId: number) {
    if(chatRoom.type !== ChatRoomType.PRIVATE) {
        throw new Error("Failed to get peer from private chat room: Chat room is not type of private");
    }

    return chatRoom.members.filter(member => member.userId !== meId)[0];
}

export const initPrivateChatOnServer = async (requestBody: {
    peerId: number,
    text: string
}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatroom/private/init`, {
        method: 'POST',
        credentials: 'include',
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

export const sendPrivateMessageOnServer = async (requestBody: {
    peerId: number,
    text: string
}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatroom/private/send`, {
        method: 'POST',
        credentials: 'include',
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

export const fetchChatRooms = async (offset: number, recordPerPage: number): Promise<ChatRoom[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatroom/get?offset=${offset}&recordPerPage=${recordPerPage}`, {
        credentials: 'include'
    });
    if(!response.ok) {
        throw new Error("Failed to fetch chat rooms");
    }
    const data : {
        chatRooms: ChatRoom[]
    } = await response.json();
    return data.chatRooms;
}

export const fetchChatMessages = async (chatRoomId: string, offset: number, recordPerPage: number): Promise<ChatMessage[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatmessage/get?offset=${offset}&recordPerPage=${recordPerPage}&chatRoomId=${chatRoomId}`, {
        credentials: 'include'
    });
    if(!response.ok) {
        throw new Error("Failed to fetch chat messages");
    }
    const data : {
        chatMessages: ChatMessage[]
    } = await response.json();
    return data.chatMessages;
}

export const autoExpandInputHeight = (element: HTMLInputElement | HTMLTextAreaElement, maxHeight: number) => {
    element.style.height = 'auto';
    const newHeight = element.scrollHeight;
    element.style.height = `${Math.min(newHeight, maxHeight)}px`;
    element.style.overflowY = newHeight > maxHeight ? "auto" : "hidden";
}