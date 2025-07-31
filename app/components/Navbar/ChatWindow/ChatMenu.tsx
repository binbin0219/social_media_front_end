import { IconMessagePlus, IconSearch, IconX } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'
import ChatRoomList from './ChatRoomList'
import UserLazyLoadList from '@/components/UserLazyLoadList/UserLazyLoadList';
import { useDispatch } from 'react-redux';
import { addPrivateChat, setActiveChatRoomId, setIsChatOpen } from '@/redux/slices/chatSlice';
import styles from './styles.module.css'
import { chatService } from '@/lib/services/chat';

const ChatMenu = () => {
    const dispatch = useDispatch();
    const [searchInput, setSearchInput] = useState("");
    const [searchResultList, setSearchResultList] = useState<React.JSX.Element | null>(null);
    const [isNewChatSearchOpen, setIsNewChatSearchOpen] = useState(false);
    const searchInputRef = useRef(null);
    
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);

        if(value.trim() === "") {
            setSearchResultList(null)
        } else {
            setSearchResultList((
                <UserLazyLoadList
                className='flex-1 overflow-y-auto'
                recordPerPage={20}
                key={value} 
                username={value} 
                onItemClick={async (result) => {
                    const chatRoom = await chatService.fetchPrivateChatRoom(result!.id);
                    dispatch(addPrivateChat(chatRoom));
                    dispatch(setActiveChatRoomId(chatRoom.id));
                    setIsNewChatSearchOpen(false);
                }}
                />
            ))
        }
    }

    return (
        <div className={`${styles['chat-window__menu']}`}>
            <div className={`flex flex-col gap-2 h-full ${isNewChatSearchOpen && 'hidden'}`}>
                <div className='flex items-center justify-between pe-3'>
                    {/* <IconMessageCircleFilled className='nav-bar-icon hover:stroke-slate-300 me-2' strokeWidth={2} width={35} height={35}/> */}
                    <h1 className='font-bold text-2xl text-center'>Chats</h1>
                    <div className='flex gap-4'>
                        <button onClick={() => setIsNewChatSearchOpen(true)} className='hover:opacity-50 cursor-pointer transition-opacity duration-300'>
                            <IconMessagePlus color='black'/>
                        </button>
                        <button className={`${styles['close']}`} onClick={() => dispatch(setIsChatOpen(false))}>
                            <IconX/>
                        </button>
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-2 pe-2 overflow-y-auto'>
                    <ChatRoomList/>
                </div>
            </div>
            <div className={`flex flex-col gap-2 pe-2 h-full ${!isNewChatSearchOpen && 'hidden'}`}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-bold text-2xl text-center'>New chat</h1>
                    <button onClick={() => setIsNewChatSearchOpen(false)} className='hover:opacity-50 cursor-pointer transition-opacity duration-300'>
                        <IconX color='black'/>
                    </button>
                </div>
                <div className='mt-2 relative'>
                    <input 
                    ref={searchInputRef} 
                    onChange={(e) => handleSearchInput(e)} 
                    value={searchInput} 
                    type="text" 
                    className='rounded-3xl p-1 border indent-8 outline-none w-full' 
                    placeholder='Search...' 
                    />
                    <IconSearch width={20} height={20} className='absolute top-[4px] start-[6px]'/>
                </div>
                {searchResultList}
            </div>
        </div>
    )
}

export default ChatMenu