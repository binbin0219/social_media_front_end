"use client"
import { IconMessageChatbot, IconMessageCircleFilled } from '@tabler/icons-react'
import React, { useEffect } from 'react'
import ChatRoom from './ChatRoom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { initPrivateChat, sendMessage, setIsChatOpen } from '@/redux/slices/chatSlice'
import UnreadMessageCounter from './unreadMessageCounter'
import { useWebSocket } from '@/context/WebSocketContext'
import ChatMenu from './ChatMenu'
import styles from './styles.module.css'
import Tooltip from '@/components/Tooltip/Tooltip'

const ChatWindow = () => {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();
    const currentUserId = useSelector((state: RootState) => state.currentUser?.id)!;
    const chatState = useSelector((state: RootState) => state.chat);
    const mobileSection = chatState.actvieChatRoomId === null ? "menu" : "chat";

    useEffect(() => {
        if(connected && client) {
            const sub = client.subscribe('/user/queue/privateMessages', (msg) => {
                const body = JSON.parse(msg.body);
                dispatch(sendMessage({
                    currentUserId,
                    chatRoomId: body.chatRoomId,
                    chatMessage: body.message,
                    messagePreview: body.messagePreview,
                    lastMessageAt: body.lastMessageAt
                }));
            })

            return () => sub.unsubscribe();
        }
    }, [connected, client, currentUserId, dispatch])

    useEffect(() => {
        if(connected && client) {
            const sub = client.subscribe('/user/queue/privateChatInit', (msg) => {
                const newChatRoom = JSON.parse(msg.body);
                dispatch(initPrivateChat({
                    newPrivateChat: newChatRoom
                }))
            })

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch])

    useEffect(() => {
        if (!client || !client.connected) {
            console.warn("Failed to open chat on server: client is disconnected!");
            return;
        };

        if (chatState.isOpen) {
            client.publish({
                destination: '/app/chat.openChat'
            });
        } else {
            client.publish({
                destination: '/app/chat.closeChat'
            });
        }
    }, [chatState.isOpen, client, connected]);

    useEffect(() => {
        if (!client || !client.connected) {
            console.warn("Failed to open chat room on server: client is disconnected!");
            return;
        };

        client.publish({
            destination: '/app/chat.setActiveChatRoomId',
            body: chatState.actvieChatRoomId ? String(chatState.actvieChatRoomId) : 'null',
        });
    }, [chatState.actvieChatRoomId, client, client?.connected]);

    const InitialChatUi = () => {
        return (
            <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
                <IconMessageChatbot width={45} height={45}/>
                Search for users or select any chats to start chatting
            </div>
        )
    }

    return (
        <div className='relative flex'>
            <Tooltip text='Chat'>
                <button onClick={() => dispatch(setIsChatOpen(!chatState.isOpen))} className='flex'>
                    <UnreadMessageCounter/>
                    <IconMessageCircleFilled className='nav-bar-icon hover:stroke-slate-300' strokeWidth={2} width={28} height={28}/>
                </button>
            </Tooltip>
            <div data-mobile-section={mobileSection} className={`${styles['chat-window']} ${chatState.isOpen && styles['show']}`}>
                <ChatMenu/>
                <div className={`${styles['chat-window__chat']}`}>
                    {chatState.actvieChatRoomId && <ChatRoom actvieChatRoomId={chatState.actvieChatRoomId} />}
                    {!chatState.actvieChatRoomId && <InitialChatUi/>}
                </div>
            </div>
        </div>
    )
}

export default ChatWindow

{/* {!isAllDataFetched && (
    <DataLoader className='flex flex-col gap-2' onVisible={() => handleDataLoaderVisible()}>
        <UserIconSkeleton width={50} height={50}/>
        <UserIconSkeleton width={50} height={50}/>
        <UserIconSkeleton width={50} height={50}/>
        <UserIconSkeleton width={50} height={50}/>
        <UserIconSkeleton width={50} height={50}/>
        <UserIconSkeleton width={50} height={50}/>
        <UserIconSkeleton width={50} height={50}/>
    </DataLoader>
)} */}