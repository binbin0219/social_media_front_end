import DynamicTooltip from '@/components/Tooltip/DynamicToolTip';
import { chatService } from '@/lib/services/chat';
import { addChatRooms, setActiveChatRoomId, setIsChatOpen } from '@/redux/slices/chatSlice';
import { MessageCircle } from 'lucide-react';
import React from 'react'
import { useDispatch } from 'react-redux';

type Props = {
    targetUserId: number;
}

const ChatButton = ({targetUserId} : Props) => {
    const dispatch = useDispatch();

    const handleCharButtonClick = async () => {
        const chatRoom = await chatService.fetchPrivateChatRoom(targetUserId);
        dispatch(setIsChatOpen(true));
        dispatch(addChatRooms([chatRoom]));
        dispatch(setActiveChatRoomId(chatRoom.id));
    }

    return (
        <DynamicTooltip text='Chat'>
            <button
                onClick={handleCharButtonClick}
                type="button"
                className="
                    w-8 h-8 flex items-center justify-center rounded-lg
                    text-textSecondary/50
                    hover:bg-appPrimary/10 hover:text-appPrimary
                    transition-colors duration-150
                "
            >
                <MessageCircle size={15} />
            </button>
        </DynamicTooltip>
    )
}

export default ChatButton