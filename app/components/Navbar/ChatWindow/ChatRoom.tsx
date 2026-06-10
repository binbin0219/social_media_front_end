"use client"
import { ChatRoomType as ChatRoomTypes } from '@/lib/models/ChatRoom';
import { autoExpandInputHeight } from '@/main';
import { addToast } from '@/redux/slices/toastSlice';
import { RootState } from '@/redux/store';
import { LogOut, SmilePlus, Send, X } from 'lucide-react';
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

const ChatRoom = ({ actvieChatRoomId, className }: Props) => {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const [typingMessage, setTypingMessage] = useState("");
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const currentUserId = useSelector((state: RootState) => state.currentUser!.id);
    const chatRoom = useSelector((state: RootState) =>
        state.chat.chatRooms.find(r => r.id === actvieChatRoomId)
    )!;
    const isPrivateRoom = chatRoom.type === ChatRoomTypes.PRIVATE;
    const peerId = isPrivateRoom
        ? chatRoom.members.find(m => m.userId !== currentUserId)?.userId ?? null
        : null;

    const peerName = chatRoom.members
        .filter(m => m.userId !== currentUserId)
        .map(m => m.username)
        .join(', ');

    useEffect(() => {
        if (messageInputRef.current) {
            autoExpandInputHeight(messageInputRef.current, 80);
        }
    }, [typingMessage]);

    const handleSendMessage = async () => {
        if (typingMessage.trim() === "" || isSendingMessage) return;

        if (!connected) {
            dispatch(addToast({ message: "Lost connection, please try again later", type: 'error' }));
            return;
        }

        try {
            setIsSendingMessage(true);
            client?.publish({
                destination: chatRoom.isTemp
                    ? '/app/chat.initPrivateChat'
                    : '/app/chat.sendPrivateMessage',
                body: JSON.stringify({ peerId: peerId!, text: typingMessage })
            });
            setTypingMessage("");
        } catch (e) {
            console.log(e);
            dispatch(addToast({ message: "Failed to send message", type: 'error' }));
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleEmojiClick = (emojiData: Skin) => {
        if (isSendingMessage) return;
        setTypingMessage(prev => prev + emojiData.native);
    };

    const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isSendingMessage) return;
        setTypingMessage(e.target.value);
    };

    const handleMessageKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const iconBtn = "w-7 h-7 flex items-center justify-center rounded-lg text-textSecondary/50 hover:bg-bgHoverSecondary hover:text-textPrimary transition-colors duration-150";

    return (
        <div className={`flex flex-col h-full p-3 gap-3 ${className}`}>

            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <h2 className="text-[15px] font-medium text-textPrimary truncate">
                    {peerName}
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        title="Leave chat"
                        onClick={() => dispatch(setActiveChatRoomId(null))}
                        className={iconBtn}
                    >
                        <LogOut size={15} />
                    </button>
                    <button
                        type="button"
                        title="Close"
                        onClick={() => dispatch(setIsChatOpen(false))}
                        className={`${iconBtn} ${/* CSS module close class */ ''}`}
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <ChatMessageList />
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 relative">
                {/* Emoji picker */}
                {isEmojiPickerOpen && (
                    <div className="absolute end-0 bottom-full mb-2 z-10">
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji: Skin) => handleEmojiClick(emoji)}
                            theme="light"
                        />
                    </div>
                )}

                <div className="
                    bg-bgPrimary border border-borderPrimary rounded-xl
                    focus-within:border-appPrimary/50 focus-within:ring-1 focus-within:ring-appPrimary/20
                    transition-colors duration-150
                    p-2.5
                ">
                    <textarea
                        ref={messageInputRef}
                        onChange={handleMessageInput}
                        onKeyDown={handleMessageKeydown}
                        value={typingMessage}
                        rows={1}
                        placeholder="Write a message…"
                        className="
                            outline-none w-full resize-none
                            bg-transparent
                            text-[13px] text-textPrimary
                            placeholder:text-textSecondary/40
                            max-h-[80px]
                        "
                    />
                    <div className="flex items-center justify-end gap-1 mt-1">
                        <button
                            type="button"
                            onClick={() => setIsEmojiPickerOpen(prev => !prev)}
                            className={`${iconBtn} ${isEmojiPickerOpen ? 'bg-amber-50 text-amber-400 dark:bg-amber-500/10' : ''}`}
                        >
                            <SmilePlus size={15} />
                        </button>
                        <LoadingButton
                            className={`${iconBtn} ${
                                typingMessage.trim()
                                    ? 'text-appPrimary hover:bg-appPrimary/10 hover:text-appPrimary'
                                    : ''
                            }`}
                            isLoading={isSendingMessage}
                            loaderColor="var(--app-color-primary)"
                            loaderWidth={14}
                            onClick={handleSendMessage}
                            text={<Send size={15} />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;