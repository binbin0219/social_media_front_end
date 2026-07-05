"use client"
import DataLoader from '@/components/DataLoader/DataLoader'
import UserIcon from '@/components/UserIcon/UserIcon'
import { ChatRoom, ChatRoomType } from '@/lib/models/ChatRoom'
import { chatService } from '@/lib/services/chat'
import { addChatRooms, setActiveChatRoomId } from '@/redux/slices/chatSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { RootState } from '@/redux/store'
import { MessageSquareDashed } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ChatRoomList = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state: RootState) => state.currentUser?.id)!;
    const chatRooms = useSelector((state: RootState) => state.chat.chatRooms);
    const actvieChatRoomId = useSelector((state: RootState) => state.chat.actvieChatRoomId);
    const [isAllDataFetched, setIsAllDataFetched] = useState(false);

    const handleDataLoaderVisible = async () => {
        setTimeout(async () => {
            try {
                const fetchedChatRooms = await chatService.fetchChatRooms(chatRooms.length, 20);
                dispatch(addChatRooms(fetchedChatRooms));
                setIsAllDataFetched(fetchedChatRooms.length < 20);
            } catch (error) {
                console.log(error);
                setIsAllDataFetched(true);
                dispatch(addToast({
                    message: "Failed to load chats! Try refreshing the page",
                    type: "error"
                }));
            }
        }, 500);
    };

    const handleChatRoomClick = (chatRoomId: string) => {
        dispatch(setActiveChatRoomId(chatRoomId));
    };

    const ChatRoomSkeletons = () => (
        <DataLoader className="flex flex-col gap-1.5" onVisible={handleDataLoaderVisible}>
            {[1, 0.8, 0.6, 0.4, 0.2].map((opacity, i) => (
                <div
                    key={i}
                    className="skeleton rounded-xl w-full h-[60px]"
                    style={{ opacity }}
                />
            ))}
        </DataLoader>
    );

    const PrivateChat = ({ chatRoom }: { chatRoom: ChatRoom }) => {
        const peer = chatService.getPeerFromPrivateChatRoom(chatRoom, currentUserId);
        const unreadCount = chatRoom.unreadCount;
        const lastMessageAt = chatRoom.lastMessageAt
            ? new Date(chatRoom.lastMessageAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
            : null;

        return (
            <>
                <UserIcon 
                    userId={peer.userId} 
                    avatarUrl={peer.avatar?.url}
                    width={40} 
                    height={40} 
                    storyUser={{
                        id: peer.userId,
                        username: peer.username,
                        stories: peer.stories,
                        updatedAt: peer.userUpdatedAt,
                        avatar: peer.avatar,
                        background: peer.background,
                    }} 
                    stories={peer.stories} />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium truncate">
                            {peer.username}
                        </p>
                        {unreadCount > 0 && (
                            <span className="
                                flex-shrink-0 min-w-[18px] h-[18px] px-1
                                rounded-full bg-appPrimary text-white
                                text-[10px] font-medium
                                flex items-center justify-center
                            ">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-[12px] text-textSecondary/60 flex-1 truncate">
                            {chatRoom.messagePreview ?? "No messages yet"}
                        </p>
                        {lastMessageAt && (
                            <p className="text-[11px] text-textSecondary/40 flex-shrink-0">
                                {lastMessageAt}
                            </p>
                        )}
                    </div>
                </div>
            </>
        );
    };

    const sorted = [...chatRooms].sort((a, b) => {
        const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return timeB - timeA;
    });

    return (
        <div className="flex flex-col gap-0.5">
            {sorted.map(chatRoom => (
                <div
                    key={chatRoom.id}
                    onClick={() => handleChatRoomClick(chatRoom.id)}
                    className={`
                        w-full flex items-center gap-2.5 rounded-xl px-2 py-2
                        cursor-pointer transition-colors duration-150
                        ${actvieChatRoomId === chatRoom.id
                            ? 'bg-appPrimary text-white'
                            : 'hover:bg-bgHoverSecondary'}
                    `}
                >
                    {chatRoom.type === ChatRoomType.GROUP ? (
                        <>
                            <div className="
                                w-10 h-10 rounded-full flex-shrink-0
                                bg-appPrimary/15 text-appPrimary
                                flex items-center justify-center
                                text-[13px] font-medium
                            ">
                                {chatRoom.name?.substring(0, 2).toUpperCase() || 'GR'}
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <p className="text-[13px] font-medium text-textPrimary truncate">
                                    {chatRoom.name || 'Group Chat'}
                                </p>
                                <p className="text-[12px] text-textSecondary/50">
                                    Group chat
                                </p>
                            </div>
                        </>
                    ) : (
                        <PrivateChat chatRoom={chatRoom} />
                    )}
                </div>
            ))}

            {!isAllDataFetched && <ChatRoomSkeletons />}

            {isAllDataFetched && chatRooms.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-10 text-center px-4">
                    <div className="w-10 h-10 rounded-full bg-bgHoverSecondary flex items-center justify-center">
                        <MessageSquareDashed size={18} className="text-textSecondary/40" />
                    </div>
                    <p className="text-[13px] text-textSecondary/50">No chats yet</p>
                </div>
            )}
        </div>
    );
};

export default ChatRoomList;
