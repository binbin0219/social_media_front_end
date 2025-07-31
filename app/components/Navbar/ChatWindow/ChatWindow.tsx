"use client"
import { IconMessageChatbot, IconMessageCircle } from '@tabler/icons-react'
import React, { useEffect } from 'react'
import ChatRoom from './ChatRoom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { initPrivateChat, sendMessage, setIsChatOpen } from '@/redux/slices/chatSlice'
import UnreadMessageCounter from './unreadMessageCounter'
import { useWebSocket } from '@/context/WebSocketContext'
import ChatMenu from './ChatMenu'
import styles from './styles.module.css'
import DynamicTooltip from '@/components/Tooltip/DynamicToolTip'

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

    const InitialChatUi = ({className}: {className?: string}) => {
        return (
            <div className={`w-full h-full flex flex-col gap-3 items-center justify-center ${className}`}>
                <IconMessageChatbot width={45} height={45}/>
                Search for users or select any chats to start chatting
            </div>
        )
    }

    return (
        <div className='relative flex'>
            <DynamicTooltip text='Chat'>
                <button 
                onClick={() => dispatch(setIsChatOpen(!chatState.isOpen))} 
                className='p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors'
                >
                    <UnreadMessageCounter/>
                    <IconMessageCircle className='h-6 w-6'/>
                </button>
            </DynamicTooltip>
            <div data-mobile-section={mobileSection} className={`${styles['chat-window']} ${chatState.isOpen && styles['show']} shadow-lg`}>
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