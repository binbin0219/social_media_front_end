import { ChatMessage } from "@/lib/models/ChatMessage";
import { ChatRoom } from "@/lib/models/ChatRoom";
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
            const actionChatRoomId = action.payload;
            if(actionChatRoomId === null) {
                state.actvieChatRoomId = null;
                return;
            }

            const chatRoom = state.chatRooms.find(chatRoom => chatRoom.id === actionChatRoomId);
            if(chatRoom) {
                state.allUnreadCount -= chatRoom.unreadCount;
                if(state.allUnreadCount < 0) {
                    state.allUnreadCount = 0;
                }

                chatRoom.unreadCount = 0;
                state.actvieChatRoomId = actionChatRoomId;
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
        addPrivateChat: (state, action: PayloadAction<ChatRoom>) => {
            const chatRoom = action.payload;
            const memberId1 = chatRoom.members[0].userId;
            const memberId2 = chatRoom.members[1].userId;
            const duplicatedIndex = findPrivateChatIndexByMemberIds(state.chatRooms, memberId1, memberId2);

            if (duplicatedIndex !== -1) {
                state.chatRooms[duplicatedIndex] = chatRoom;
            } else {
                state.chatRooms.push(chatRoom);
            }
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
            newPrivateChat: ChatRoom
        }>) => {
            const { newPrivateChat } = action.payload;
            const firstMemberId = newPrivateChat.members[0].userId;
            const secondMemberId = newPrivateChat.members[1].userId;
            const tempPrivateChatIndex = findPrivateChatIndexByMemberIds(state.chatRooms, firstMemberId, secondMemberId);

            if (tempPrivateChatIndex !== -1) {
                const isTempChatActive = state.actvieChatRoomId === state.chatRooms[tempPrivateChatIndex].id;
                if(isTempChatActive) {
                    state.actvieChatRoomId = newPrivateChat.id;
                }

                state.chatRooms[tempPrivateChatIndex] = newPrivateChat;
            } else {
                state.chatRooms.push(newPrivateChat);
                state.allUnreadCount++;
            }
        },
        setAllChatMessagesLoaded: (state, action: PayloadAction<{
            chatRoomId: string;
            isAllMessagesLoaded: boolean;
        }>) => {
            const { chatRoomId, isAllMessagesLoaded } = action.payload;
            const chatRoom = state.chatRooms.find(chatRoom => chatRoom.id === chatRoomId);
            if(chatRoom) {
                chatRoom.isAllMessagesLoaded = isAllMessagesLoaded;
            }
        }
    }
});

export const { 
    setIsChatOpen, 
    setActiveChatRoomId, 
    setChatRooms, 
    addChatRooms, 
    addMessages, 
    sendMessage, 
    initPrivateChat,
    addPrivateChat,
    setAllChatMessagesLoaded
} = chatSlice.actions;
export default chatSlice.reducer

function findPrivateChatIndexByMemberIds(chatRooms: ChatRoom[], firstTargetMemberId: number, secondTargetMemberId: number) {
    return chatRooms.findIndex(chatRoom => {
        const firstMemberId = chatRoom.members[0].userId;
        const secondMemberId = chatRoom.members[1].userId;
        if(
            (firstMemberId === firstTargetMemberId || secondMemberId === firstTargetMemberId) &&
            ((firstMemberId === secondTargetMemberId || secondMemberId === secondTargetMemberId))
        ) {
            return true
        }

        return false;
    });
}