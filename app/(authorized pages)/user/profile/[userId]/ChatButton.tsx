import Tooltip from '@/components/Tooltip/Tooltip';
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
        <Tooltip text='Chat'>
            <button 
            onClick={() => handleCharButtonClick()}
            type='button'
            className='bg-green-200 border-green-400 text-green-600 hover:bg-green-300 border-2 px-3 py-2 rounded-lg mb-1'
            >
                <IconMessageCircle/>
            </button>
        </Tooltip>
    )
}

export default ChatButton