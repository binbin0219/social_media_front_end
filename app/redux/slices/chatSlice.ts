import { ChatMessage } from "@/lib/models/ChatMessage";
import { ChatRoom, UnreadMessageCount } from "@/lib/models/ChatRoom";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatState = {
    isOpen: boolean;
    actvieChatRoomId: string | null;
    chatRooms: ChatRoom[];
    allUnreadCount: number;
};

export const initialState: ChatState = {
    isOpen: false,
    actvieChatRoomId: null,
    chatRooms: [],
    allUnreadCount: 0
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setIsChatOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;

            const activeChatRoom = state.chatRooms.find(charRoom => charRoom.id === state.actvieChatRoomId);
            if(activeChatRoom) {
                state.allUnreadCount -= activeChatRoom.unreadCount;
                activeChatRoom.unreadCount = 0;
            }
        },
        setActiveChatRoomId: (state, action: PayloadAction<string | null>) => {
            const chatRoom = state.chatRooms.find(chatRoom => chatRoom.id === action.payload);
            if(chatRoom) {
                state.allUnreadCount -= chatRoom.unreadCount;
                chatRoom.unreadCount = 0;
                state.actvieChatRoomId = action.payload;
            }
        },
        setChatRooms: (state, action: PayloadAction<ChatRoom[]>) => {
            state.chatRooms = action.payload;
        },
        addChatRooms: (state, action: PayloadAction<ChatRoom[]>) => {
            const existingChatRoomIds = new Set(state.chatRooms.map(chatRoom => chatRoom.id));
            const newChatRooms = action.payload.filter(chatRoom => !existingChatRoomIds.has(chatRoom.id));
            state.chatRooms.push(...newChatRooms);
        },
        addMessages: (state, action: PayloadAction<{
            chatRoomId: string,
            chatMessages: ChatMessage[]
        }>) => {
            const chatRoom = state.chatRooms.find(chatroom => chatroom.id === action.payload.chatRoomId);
            if(chatRoom) {
                const existingChatMessagesId = new Set(chatRoom.messages?.map(chatMessage => chatMessage.id));
                const newChatMessages = action.payload.chatMessages.filter(chatMessage => !existingChatMessagesId.has(chatMessage.id));

                if(!chatRoom.messages) {
                    chatRoom.messages = [];
                }

                chatRoom.messages.unshift(...newChatMessages);
            }
        },
        sendMessage: (state, action: PayloadAction<{
            currentUserId: number,
            chatRoomId: string,
            chatMessage: ChatMessage,
            messagePreview: string,
            lastMessageAt: string
        }>) => {
            const chatRoom = state.chatRooms.find(chatroom => chatroom.id === action.payload.chatRoomId);
            if(chatRoom) {
                
                if(!chatRoom.messages) {
                    chatRoom.messages = [];
                }

                chatRoom.messages.push(action.payload.chatMessage);
                chatRoom.lastMessageAt = action.payload.lastMessageAt;
                chatRoom.messagePreview = action.payload.messagePreview;
            }

            if(chatRoom) {
                const isOtherUserSent = action.payload.chatMessage.senderId !== action.payload.currentUserId;
                const isChatRoomActive = action.payload.chatRoomId === state.actvieChatRoomId;
                if(isOtherUserSent && ( !state.isOpen || !isChatRoomActive)) {
                    chatRoom.unreadCount++;
                    state.allUnreadCount++;
                }
            } else {
                state.allUnreadCount++;
            }
        },
        initPrivateChat: (state, action: PayloadAction<{
            tempPrivateChatId: string,
            newPrivateChat: ChatRoom
        }>) => {
            const index = state.chatRooms.findIndex(chatroom => chatroom.id === action.payload.tempPrivateChatId);
            if (index !== -1) {
                state.chatRooms[index] = action.payload.newPrivateChat;
                state.actvieChatRoomId = action.payload.newPrivateChat.id;
            }
        }
    }
});

export const { setIsChatOpen, setActiveChatRoomId, setChatRooms, addChatRooms, addMessages, sendMessage, initPrivateChat } = chatSlice.actions;
export default chatSlice.reducer