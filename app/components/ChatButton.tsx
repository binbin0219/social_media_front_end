import DynamicTooltip from '@/components/Tooltip/DynamicToolTip';
import { chatService } from '@/lib/services/chat';
import { addChatRooms, setActiveChatRoomId, setIsChatOpen } from '@/redux/slices/chatSlice';
import { IconMessageCircle } from '@tabler/icons-react'
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
            onClick={() => handleCharButtonClick()}
            type='button'
            className='bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600'
            >
                <IconMessageCircle/>
            </button>
        </DynamicTooltip>
    )
}

export default ChatButton