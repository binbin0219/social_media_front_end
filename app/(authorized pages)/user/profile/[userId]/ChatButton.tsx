import { ChatRoom } from '@/lib/models/ChatRoom';
import { addChatRooms, setActiveChatRoomId, setIsChatOpen } from '@/redux/slices/chatSlice';
import { RootState } from '@/redux/store';
import { IconMessageCircle } from '@tabler/icons-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    targetUserId: number;
}

const ChatButton = ({targetUserId} : Props) => {
    const dispatch = useDispatch();

    const handleCharButtonClick = async () => {
        const chatRoom = await fetchPrivateChatRoom(targetUserId);
        dispatch(setIsChatOpen(true));
        dispatch(addChatRooms([chatRoom]));
        dispatch(setActiveChatRoomId(chatRoom.id));
    }

    const fetchPrivateChatRoom = async (userId: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatroom/private/get?userId=${userId}`, {
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error("Failed to fetch private chat room");
        }
        const data: {chatRoom: ChatRoom} = await response.json();
        return data.chatRoom as ChatRoom;
    }

    return (
        <button 
        onClick={() => handleCharButtonClick()}
        type='button'
        className='bg-green-200 border-green-400 text-green-600 hover:bg-green-300 border-2 px-3 py-2 rounded-lg mb-1'
        >
            <IconMessageCircle className='inline me-2'/>
            Chat
        </button>
    )
}

export default ChatButton