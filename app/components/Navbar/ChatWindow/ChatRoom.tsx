"use client"
import { ChatRoomType as ChatRoomTypes } from '@/lib/models/ChatRoom';
import { autoExpandInputHeight } from '@/main';
import { addToast } from '@/redux/slices/toastSlice';
import { RootState } from '@/redux/store';
import { IconLogout, IconMoodSmile, IconSend, IconX } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ChatMessageList from './ChatMessageList';
import { useWebSocket } from '@/context/WebSocketContext';
import { setActiveChatRoomId, setIsChatOpen } from '@/redux/slices/chatSlice';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import Picker from '@emoji-mart/react'
import data, { Skin } from '@emoji-mart/data'

type Props = {
    actvieChatRoomId: string;
    className?: string;
}

const ChatRoom = ({actvieChatRoomId, className} : Props) => {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const [typingMessage, setTypingMessage] = useState("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const currentUserId = useSelector((state: RootState) => state.currentUser!.id);
    const chatRoom =  useSelector((state: RootState) => state.chat.chatRooms.find(chatRoom => chatRoom.id === actvieChatRoomId))!;
    const isPrivateRoom = chatRoom.type === ChatRoomTypes.PRIVATE;
    const peerId = isPrivateRoom ? (chatRoom.members.filter(member => member.userId !== currentUserId)[0].userId) : null;

    useEffect(() => {
        if(messageInputRef.current) {
            autoExpandInputHeight(messageInputRef.current, 80);
        }
    }, [typingMessage])

    const handleSendMessage = async () => {
        if(typingMessage.trim() === "") {
            return;
        }

        if(!connected) {
            dispatch(addToast({
                message: "Lost connection, please try again later",
                type: 'error'
            }));
            return;
        }

        if(isSendingMessage) return;

        try {
            setIsSendingMessage(true);
            if(chatRoom.isTemp) {
                client?.publish({
                    destination: '/app/chat.initPrivateChat',
                    body: JSON.stringify({
                        peerId: peerId!,
                        text: typingMessage
                    })
                });
            } else {
                client?.publish({
                    destination: '/app/chat.sendPrivateMessage',
                    body: JSON.stringify({
                        peerId: peerId!,
                        text: typingMessage
                    })
                });
            }
            setTypingMessage("");
        } catch (e) {
            console.log(e);
            dispatch(addToast({
                message: "Failed to send message",
                type: 'error'
            }));
        } finally {
            setIsSendingMessage(false);
        }
    }

    const handleEmojiClick = (emojiData: Skin) => {
        if(isSendingMessage) return;
        setTypingMessage(prev => prev + emojiData.native);
    }

    const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if(isSendingMessage) return;
        setTypingMessage(e.target.value);
    }

    const handleMessageKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className={`ps-3 py-1 pe-1 h-full flex flex-col ${className}`}>
            <div className='pb-4 flex justify-between items-start' style={{height: "10%"}}>
                <h1 className='text-2xl font-bold'>
                {chatRoom.members
                    .filter(member => member.userId !== currentUserId)
                    .map(member => member.username)
                    .join(', ')
                }
                </h1>
                <div className='flex items-center gap-3' onClick={() => dispatch(setActiveChatRoomId(null))}>
                    <button type='button'>
                        <IconLogout/>
                    </button>
                    <button type='button' onClick={() => dispatch(setIsChatOpen(false))}>
                        <IconX/>
                    </button>
                </div>
            </div>
            <ChatMessageList/>
            <div className='pt-3 relative'>
                <div className={`absolute end-0 ${!isEmojiPickerOpen && 'hidden'}`} style={{bottom: '100%'}}>
                    <Picker data={data} onEmojiSelect={(emoji: Skin) => handleEmojiClick(emoji)} theme="light" />
                </div>
                <div className='border w-full p-2 rounded'>
                    <textarea 
                    ref={messageInputRef}
                    onChange={(e) => handleMessageInput(e)} 
                    onKeyDown={(e) => handleMessageKeydown(e)}
                    value={typingMessage} rows={1} 
                    placeholder='Write some message...' 
                    className='outline-none w-full resize-none'
                    >
                    </textarea>
                    <div className='flex gap-2 w-full justify-end'>
                        <button onClick={() => setIsEmojiPickerOpen(prev => !prev)} type='button' className='hover:opacity-20 cursor-pointer transition-opacity duration-300'>
                            {isEmojiPickerOpen && <IconMoodSmile fill='yellow' color={'#ffcc00'}/>}
                            {!isEmojiPickerOpen && <IconMoodSmile/>}
                        </button>
                        {/* <button type='button' className='hover:opacity-20 cursor-pointer transition-opacity duration-300'>
                            <IconPhoto/>
                        </button> */}
                        <LoadingButton
                        className='hover:opacity-20 cursor-pointer transition-opacity duration-300'
                        isLoading={isSendingMessage}
                        loaderColor='#9691a5'
                        onClick={() => handleSendMessage()}
                        text={<IconSend/>}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom