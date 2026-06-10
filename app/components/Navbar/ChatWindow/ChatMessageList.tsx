"use client"
import { RootState } from '@/redux/store'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChatRoomType } from '@/lib/models/ChatRoom'
import { ChatMessage } from '@/lib/models/ChatMessage'
import DataLoader from '@/components/DataLoader/DataLoader'
import { addMessages, setActiveChatRoomId, setAllChatMessagesLoaded } from '@/redux/slices/chatSlice'
import styles from './styles.module.css'
import { addToast } from '@/redux/slices/toastSlice'
import Image from 'next/image'
import { chatService } from '@/lib/services/chat'
import { MessageSquareDashed } from 'lucide-react'

const ChatMessageList = () => {
    const dispatch = useDispatch();
    const hasInitialScrollRef = useRef(false);
    const lastestMessageRef = useRef<ChatMessage>(null);
    const messageListRef = useRef<HTMLDivElement>(null);
    const currentUserId = useSelector((state: RootState) => state.currentUser?.id)!;
    const chatRoom = useSelector((state: RootState) =>
        state.chat.chatRooms.find(r => r.id === state.chat.actvieChatRoomId)
    )!;
    const isAllMessageFetched = chatRoom?.isAllMessagesLoaded;
    const isPrivateRoom = chatRoom?.type === ChatRoomType.PRIVATE;

    useEffect(() => {
        if (!chatRoom) return;
        const container = messageListRef.current;
        if (!container || !chatRoom.messages) return;

        if (!hasInitialScrollRef.current && chatRoom.messages.length > 0) {
            container.scrollTop = container.scrollHeight;
            hasInitialScrollRef.current = true;
        }

        const currentLatest = chatRoom.messages[chatRoom.messages.length - 1];
        if (lastestMessageRef.current !== currentLatest) {
            container.scrollTop = container.scrollHeight;
            lastestMessageRef.current = currentLatest;
        }
    }, [chatRoom, chatRoom?.messages]);

    if (!chatRoom) {
        dispatch(setActiveChatRoomId(null));
        dispatch(addToast({ message: "Failed to open chat", type: 'error' }));
        return null;
    }

    const handleDataLoaderVisible = async () => {
        setTimeout(async () => {
            const oldScrollTop = messageListRef.current!.scrollTop;
            await fetchMoreMessages();
            const newScrollTop = messageListRef.current!.scrollTop;
            messageListRef.current!.scrollTop = -(newScrollTop - oldScrollTop);
        }, 500);
    };

    const fetchMoreMessages = async () => {
        const start = chatRoom.messages?.length ?? 0;
        const length = 10;
        const messages = await chatService.fetchChatMessages(chatRoom.id, start, length);
        dispatch(addMessages({ chatRoomId: chatRoom.id, chatMessages: messages }));
        if (messages.length < length) {
            dispatch(setAllChatMessagesLoaded({
                chatRoomId: chatRoom.id,
                isAllMessagesLoaded: true
            }));
        }
    };

    const Message = ({ message, amISender }: { message: ChatMessage; amISender: boolean }) => {
        const sentAt = new Date(message.createAt).toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true,
        });

        return (
            <div className={`flex items-end gap-1.5 w-full ${amISender ? 'justify-end' : 'justify-start'}`}>
                {/* Timestamp + sender name */}
                <div className={`flex flex-col gap-0.5 mb-0.5 ${amISender ? 'items-end' : 'items-start'}`}>
                    {!isPrivateRoom && (
                        <p className="text-[10px] text-textSecondary/50 px-1">
                            {message.senderUsername}
                        </p>
                    )}
                    <p className="text-[10px] text-textSecondary/40 px-1">{sentAt}</p>
                </div>

                {/* Bubble */}
                <div className={`
                    w-fit max-w-[60%] px-3 py-2 text-[13px] leading-relaxed
                    ${amISender
                        ? 'bg-appPrimary text-white rounded-2xl rounded-tr-sm'
                        : 'bg-bgHoverSecondary text-textPrimary rounded-2xl rounded-tl-sm border border-borderPrimary'
                    }
                `}>
                    {message.attachments.length > 0 && (
                        <div
                            data-img-count={message.attachments.length}
                            className={`max-w-full grid gap-1 mb-2 ${styles['img-auto-grid']}`}
                        >
                            {message.attachments.map((attachment, i) => (
                                <div key={i} className="flex items-center row-span-2">
                                    <Image
                                        alt="Chat attachment"
                                        className="rounded hover:opacity-70 cursor-pointer"
                                        src={attachment.link}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {message.text}
                </div>
            </div>
        );
    };

    const MessageDateTag = ({ createAt }: { createAt: Date }) => {
        const now = new Date();
        const isToday =
            now.getDate() === createAt.getDate() &&
            now.getMonth() === createAt.getMonth() &&
            now.getFullYear() === createAt.getFullYear();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const isThisWeek = createAt >= startOfWeek;

        const label = isToday
            ? 'Today'
            : isThisWeek
                ? createAt.toLocaleDateString('en-US', { weekday: 'long' })
                : createAt.toLocaleDateString();

        return (
            <div className="flex items-center justify-center gap-3 my-2 px-2 w-full">
                <span className="text-[11px] font-medium text-textSecondary/40 whitespace-nowrap">
                    {label}
                </span>
            </div>
        );
    };

    return (
        <div
            ref={messageListRef}
            className="flex flex-1 flex-col-reverse overflow-y-auto gap-2 pb-2 pe-1"
        >
            {/* Empty state */}
            {isAllMessageFetched && (!chatRoom.messages || chatRoom.messages.length === 0) && (
                <div className="flex flex-col items-center gap-3 my-auto text-center px-6">
                    <div className="w-10 h-10 rounded-full bg-bgHoverSecondary flex items-center justify-center">
                        <MessageSquareDashed size={18} className="text-textSecondary/40" />
                    </div>
                    <p className="text-[13px] text-textSecondary/50">
                        Send a message to start the conversation
                    </p>
                </div>
            )}

            {/* Messages */}
            {chatRoom.messages?.map((message, index) => {
                const amISender = message.senderId === currentUserId;
                const nextCreateAt = index !== chatRoom.messages!.length - 1
                    ? new Date(chatRoom.messages![index + 1].createAt.split('T')[0])
                    : null;
                const createAt = new Date(message.createAt.split('T')[0]);
                const showDateTag = !nextCreateAt || nextCreateAt.getDate() !== createAt.getDate();

                return (
                    <div key={message.id} className={`flex flex-col gap-2 ${amISender ? 'items-end' : 'items-start'}`}>
                        {showDateTag && <MessageDateTag createAt={createAt} />}
                        <Message amISender={amISender} message={message} />
                    </div>
                );
            })}

            {/* Load more skeletons */}
            {!isAllMessageFetched && (
                <DataLoader className="flex flex-col gap-2 pb-2" onVisible={handleDataLoaderVisible}>
                    <div className="skeleton opacity-60 rounded-2xl rounded-tl-sm" style={{ width: '220px', height: '48px' }} />
                    <div className="skeleton opacity-40 rounded-2xl rounded-tl-sm" style={{ width: '170px', height: '48px' }} />
                    <div className="skeleton opacity-60 rounded-2xl rounded-tr-sm self-end" style={{ width: '190px', height: '48px' }} />
                </DataLoader>
            )}
        </div>
    );
};

export default ChatMessageList;