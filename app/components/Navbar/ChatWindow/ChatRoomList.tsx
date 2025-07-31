"use client"
import DataLoader from '@/components/DataLoader/DataLoader'
import UserIcon from '@/components/UserIcon/UserIcon'
import { ChatRoom, ChatRoomType } from '@/lib/models/ChatRoom'
import { chatService } from '@/lib/services/chat'
import { addChatRooms, setActiveChatRoomId } from '@/redux/slices/chatSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { RootState } from '@/redux/store'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ChatRoomList = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector((state: RootState) => state.currentUser?.id)!;
    const chatRooms = useSelector((state: RootState) => state.chat.chatRooms);
    const actvieChatRoomId = useSelector((state: RootState) => state.chat.actvieChatRoomId);
    const [isAllDataFetched, setIsAllDataFetched] = useState(false);

    const handleDataLoaderVisible = async () => {
        setTimeout(async () => {
            try {
                const fecthedChatRooms = await chatService.fetchChatRooms(chatRooms.length, 20);
                dispatch(addChatRooms(fecthedChatRooms));
                setIsAllDataFetched(fecthedChatRooms.length < 20);
            } catch (error) {
                console.log(error);
                setIsAllDataFetched(true);
                dispatch(addToast({
                    message: "Failed to load chats! Try refresh the page",
                    type: "error"
                }))
            }
        }, 500);
    }

    const handleChatRoomClick = (chatRoomId: string) => {
        dispatch(setActiveChatRoomId(chatRoomId));
    }

    const ChatRoomSkeletons = () => {
        return (
            <DataLoader className='flex flex-col gap-2' onVisible={() => handleDataLoaderVisible()}>
                <div className={`skeleton`} style={{width: '100%', height: '70px'}}></div>
                <div className={`skeleton opacity-80`} style={{width: '100%', height: '70px'}}></div>
                <div className={`skeleton opacity-60`} style={{width: '100%', height: '70px'}}></div>
                <div className={`skeleton opacity-40`} style={{width: '100%', height: '70px'}}></div>
                <div className={`skeleton opacity-20`} style={{width: '100%', height: '70px'}}></div>
            </DataLoader>
        )
    }

    const PrivateChat = ({chatRoom}: {chatRoom: ChatRoom}) => {
        const peer = chatService.getPeerFromPrivateChatRoom(chatRoom, currentUserId);
        const unreadCount = chatRoom.unreadCount;

        let lastMessageAt = null;
        if(chatRoom.lastMessageAt) {
            lastMessageAt = new Date(chatRoom.lastMessageAt ?? "").toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }

        return (
            <>
                <UserIcon userId={peer.userId} updatedAt={peer.userUpdatedAt} width={45} height={45} />
                <div className='flex flex-col gap-1 h-100 flex-1'>
                    <div className='flex w-full justify-between'>
                        <p className='text-sm flex-1'>{peer.username}</p>
                        {unreadCount > 0 && (
                            <span className='p-1 rounded-full bg-red-500 text-xs text-white w-[23px] h-[23px] text-center'>{unreadCount}</span>
                        )}
                    </div>
                    <div className='flex gap-2 w-full'>
                        <p className='text-slate-500 text-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap'>{chatRoom.messagePreview ?? "No message yet"}</p>
                        <p className='text-black-500 text-xs'>{lastMessageAt}</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {[...chatRooms]
            .sort((a, b) => {
                const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                return timeB - timeA;
            })
            .map(chatRoom => (
                <div 
                onClick={() => handleChatRoomClick(chatRoom.id)} 
                key={chatRoom.id} 
                className={`w-full flex items-center gap-3 rounded p-3 cursor-pointer hover-soft hover:bg-slate-100 ${actvieChatRoomId === chatRoom.id ? 'bg-slate-200' : ''}`}
                >
                    {chatRoom.type === ChatRoomType.GROUP ? (
                        <>
                            <div className='w-[45px] h-[45px] bg-blue-400 text-white flex items-center justify-center rounded-full text-lg font-bold'>
                                {chatRoom.name?.substring(0, 2).toUpperCase() || 'GR'}
                            </div>
                            <div className='flex flex-col gap-1 h-100'>
                                <p className='text-sm font-medium'>{chatRoom.name || 'Group Chat'}</p>
                                <p className='text-slate-500 text-xs'>Group chat</p>
                            </div>
                        </>
                    ) : (
                        <PrivateChat chatRoom={chatRoom}/>
                    )}
                </div>
            ))}
            {!isAllDataFetched && <ChatRoomSkeletons/>}
            {isAllDataFetched && chatRooms.length === 0 && (
                <p className='text-center p-3'>No chats yet</p>
            )}
        </>
        
    )
}

export default ChatRoomList