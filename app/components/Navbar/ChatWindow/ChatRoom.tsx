"use client"
import { ChatRoom as ChatRoomType, ChatRoomType as ChatRoomTypes } from '@/lib/models/ChatRoom';
import { autoExpandInputHeight } from '@/main';
import { addToast } from '@/redux/slices/toastSlice';
import { RootState } from '@/redux/store';
import { IconMoodSmile, IconSend, IconX } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ChatMessageList from './ChatMessageList';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useWebSocket } from '@/context/WebSocketContext';
import { setActiveChatRoomId } from '@/redux/slices/chatSlice';

type Props = {
    actvieChatRoomId: string;
}

const ChatRoom = ({actvieChatRoomId} : Props) => {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const [typingMessage, setTypingMessage] = useState("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
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

        try {
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
        }
    }

    const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
        setTypingMessage(prev => prev + emojiData.emoji);
    }

    const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTypingMessage(e.target.value);
    }

    const handleMessageKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className='ps-3 py-1 pe-1 h-full flex flex-col'>
            <div className='pb-4 flex justify-between items-start' style={{height: "10%"}}>
                <h1 className='text-2xl font-bold'>
                {chatRoom.members
                    .filter(member => member.userId !== currentUserId)
                    .map(member => member.username)
                    .join(', ')
                }
                </h1>
                <button type='button' onClick={() => dispatch(setActiveChatRoomId(null))}>
                    <IconX/>
                </button>
            </div>
            <ChatMessageList/>
            <div className='pt-3 relative'>
                <div className={`absolute end-0 ${!isEmojiPickerOpen && 'hidden'}`} style={{bottom: '100%'}}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} height={400} previewConfig={{
                        showPreview: false
                    }}/>
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
                            <IconMoodSmile/>
                        </button>
                        {/* <button type='button' className='hover:opacity-20 cursor-pointer transition-opacity duration-300'>
                            <IconPhoto/>
                        </button> */}
                        <button onClick={() => handleSendMessage()} type='button' className='hover:opacity-20 cursor-pointer transition-opacity duration-300'>
                            <IconSend/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom