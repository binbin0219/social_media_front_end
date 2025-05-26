"use client"
import React from 'react'
import UnreadMessageCounter from './ChatWindow/unreadMessageCounter'
import { IconMessageCircleFilled } from '@tabler/icons-react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIsChatOpen } from '@/redux/slices/chatSlice';

const ChatWindowTrigger = () => {
    const dispatch = useDispatch();
    const isChatOpen = useSelector((state: RootState) => state.chat.isOpen);

    const handleClick = () => {
        dispatch(setIsChatOpen(!isChatOpen));
    }

    return (
        <button onClick={() => handleClick()} className=''>
            <UnreadMessageCounter/>
            <IconMessageCircleFilled className='nav-bar-icon hover:stroke-slate-300' strokeWidth={2} width={28} height={28}/>
        </button>
    )
}

export default ChatWindowTrigger