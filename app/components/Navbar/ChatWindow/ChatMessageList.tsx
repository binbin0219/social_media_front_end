"use client"
import { RootState } from '@/redux/store'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChatRoomType } from '@/lib/models/ChatRoom'
import { ChatMessage } from '@/lib/models/ChatMessage'
import DataLoader from '@/components/DataLoader/DataLoader'
import { addMessages, setActiveChatRoomId, setAllChatMessagesLoaded } from '@/redux/slices/chatSlice'
import styles from './styles.module.css';
import { addToast } from '@/redux/slices/toastSlice'
import Image from 'next/image'
import { chatService } from '@/lib/services/chat'

const ChatMessageList = () => {
    const dispatch = useDispatch();
    const hasInitialScrollRef = useRef(false);
    const lastestMessageRef = useRef<ChatMessage>(null);
    const messageListRef = useRef<HTMLDivElement>(null);
    const currentUserId = useSelector((state: RootState) => state.currentUser?.id)!;
    const chatRoom = useSelector((state: RootState) => 
        state.chat.chatRooms.find(chatRoom => chatRoom.id === state.chat.actvieChatRoomId))!;    
    const isAllMessageFetched = chatRoom.isAllMessagesLoaded;
    const isPrivateRoom = chatRoom?.type === ChatRoomType.PRIVATE ? true : false;

    useEffect(() => {
        if(!chatRoom) return;
        const container = messageListRef.current;
        if (!container || !chatRoom.messages) return;
    
        if (!hasInitialScrollRef.current && chatRoom.messages.length > 0) {
            container.scrollTop = container.scrollHeight;
            hasInitialScrollRef.current = true;
        }

        const currentLastestMessage = chatRoom.messages[chatRoom.messages.length - 1];
        if(lastestMessageRef.current !== currentLastestMessage) {
            container.scrollTop = container.scrollHeight;
            lastestMessageRef.current = currentLastestMessage;
        }

    }, [chatRoom, chatRoom.messages]);

    if(!chatRoom) {
        dispatch(setActiveChatRoomId(null));
        dispatch(addToast({
            message: "Failed to open chat",
            type: 'error'
        }));
        return;
    };

    const handleDataLoaderVisible = async () => {
        setTimeout(async () => {
            const oldScrollHeight = messageListRef.current!.scrollHeight;
            await fetchMoreMessages();
            const newScrollHeight = messageListRef.current!.scrollHeight;
            messageListRef.current!.scrollTop += (newScrollHeight - oldScrollHeight);
        }, 500);
    }

    const fetchMoreMessages = async () => {
        const offset = chatRoom.messages?.length ?? 0;
        const recordPerPage = 10;
        const messages = await chatService.fetchChatMessages(chatRoom.id, offset, recordPerPage);
        dispatch(addMessages({
            chatRoomId: chatRoom.id,
            chatMessages: messages
        }));

        const isAllMessageFetched = messages.length < recordPerPage;
        if(isAllMessageFetched) {
            dispatch(setAllChatMessagesLoaded({
                chatRoomId: chatRoom.id,
                isAllMessagesLoaded: isAllMessageFetched
            }))
        }
    }
        
    const Message = ({message, amISender}: {
        message: ChatMessage;
        amISender: boolean;
    }) => {
        const sentAt = new Date(message.createAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return (
            <div 
            className={`flex items-end gap-2 w-full ${amISender ? '' : 'flex-row-reverse'}`}
            style={{justifyContent: amISender ? 'end' : 'start'}}
            >
                {!isPrivateRoom && <p className={`text-xs mb-1 ${amISender ? 'text-end' : ''}`}>{message.senderUsername}</p>}
                <p className={`text-[10px] mt-1 ${amISender ? 'text-end' : ''}`}>{sentAt}</p>
                <div
                className={`
                    bg-slate-200 w-fit p-3 rounded-lg 
                    ${amISender ? 'rounded-tr-none' : 'rounded-tl-none'}
                `} 
                style={{maxWidth: "60%"}}
                >   
                    {message.attachments.length > 0 && (
                        <div data-img-count={message.attachments.length} className={`max-w-full grid gap-1 ${styles['img-auto-grid']}`}>
                            {message.attachments.map((attachment, index) => (
                                <div key={index} className='flex items-center row-span-2 mb-2'>
                                    <Image
                                    alt='Chat attachment' 
                                    className='rounded hover:opacity-60 cursor-pointer'
                                    src={attachment.link}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {message.text}
                </div>
            </div>
        )
    }

    const MessageDateTag = ({ createAt }: { createAt: Date }) => {
        const now = new Date();
    
        const isToday =
            now.getDate() === createAt.getDate() &&
            now.getMonth() === createAt.getMonth() &&
            now.getFullYear() === createAt.getFullYear();
    
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const isThisWeek = createAt >= startOfWeek;
    
        if (isToday) {
            return <p className='text-slate-400 text-xs w-full text-center mt-4'>Today</p>;
        } else if (isThisWeek) {
            return (
                <p className='text-slate-400 text-xs w-full text-center mt-4'>
                    {createAt.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
            );
        } else {
            return <p className='text-slate-400 text-xs w-full text-center mt-4'>{createAt.toLocaleDateString()}</p>;
        }
    };

    return (
        <div ref={messageListRef} className='flex flex-1 flex-col overflow-y-auto gap-4 pb-6 pe-1'>
            {!isAllMessageFetched && (
                <DataLoader className='flex flex-col gap-4' onVisible={() => handleDataLoaderVisible()}>
                    <div className={`skeleton opacity-80`} style={{width: '250px', height: '55px', borderRadius: "10px", borderTopLeftRadius: "0"}}></div>
                    <div className={`skeleton opacity-80`} style={{width: '200px', height: '55px', borderRadius: "10px", borderTopLeftRadius: "0"}}></div>
                    <div className={`skeleton opacity-80 self-end`} style={{width: '200px', height: '55px', borderRadius: "10px", borderTopRightRadius: "0"}}></div>
                </DataLoader>
            )}
            {chatRoom.messages && chatRoom.messages.map((message, index) => {
                const amISender = message.senderId === currentUserId;
                const lastCreateAt = index !== 0 ? new Date(chatRoom.messages![index - 1].createAt.split('T')[0]) : null;
                const createAt = new Date(message.createAt.split('T')[0]);

                return (
                    <div key={message.id} className={`flex flex-col gap-4 ${amISender && 'items-end'}`}>
                        {!lastCreateAt && <MessageDateTag createAt={createAt}/>}
                        {lastCreateAt && lastCreateAt.getDate() !== createAt.getDate() &&
                            <MessageDateTag createAt={createAt}/>
                        }
                        <Message amISender={amISender} message={message}/>
                    </div>
                )
            })}
            {isAllMessageFetched && (!chatRoom.messages || chatRoom.messages.length === 0) && (
                <p className='font-bold text-slate-500 text-m text-center my-auto'> Send message to start the chat journey !</p>
            )}
        </div>
    )
}

export default ChatMessageList