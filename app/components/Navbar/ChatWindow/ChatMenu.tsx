import { MessageSquarePlus, Search, X } from 'lucide-react'
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

        if (value.trim() === "") {
            setSearchResultList(null);
        } else {
            setSearchResultList((
                <UserLazyLoadList
                    className="flex-1 overflow-y-auto"
                    length={20}
                    key={value}
                    username={value}
                    onItemClick={async (result) => {
                        const chatRoom = await chatService.fetchPrivateChatRoom(result!.id);
                        dispatch(addPrivateChat(chatRoom));
                        dispatch(setActiveChatRoomId(chatRoom.id));
                        setIsNewChatSearchOpen(false);
                    }}
                />
            ));
        }
    };

    const iconBtn = "w-7 h-7 flex items-center justify-center rounded-lg text-textSecondary/50 hover:bg-bgHoverSecondary hover:text-textPrimary transition-colors duration-150";

    return (
        <div className={styles['chat-window__menu']}>

            {/* Main — chat list */}
            <div className={`flex flex-col gap-3 h-full p-3 ${isNewChatSearchOpen ? 'hidden' : ''}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-medium text-textPrimary">Chats</h2>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsNewChatSearchOpen(true)}
                            className={iconBtn}
                            title="New chat"
                        >
                            <MessageSquarePlus size={16} />
                        </button>
                        <button
                            className={`${iconBtn} ${styles['close']}`}
                            onClick={() => dispatch(setIsChatOpen(false))}
                            title="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-2 overflow-y-auto">
                    <ChatRoomList />
                </div>
            </div>

            {/* New chat — user search */}
            <div className={`flex flex-col gap-3 h-full p-3 ${!isNewChatSearchOpen ? 'hidden' : ''}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-medium text-textPrimary">New chat</h2>
                    <button
                        onClick={() => setIsNewChatSearchOpen(false)}
                        className={iconBtn}
                        title="Back"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="relative">
                    <Search
                        size={14}
                        className="absolute top-1/2 -translate-y-1/2 start-3 text-textSecondary/40 pointer-events-none"
                    />
                    <input
                        ref={searchInputRef}
                        onChange={handleSearchInput}
                        value={searchInput}
                        type="text"
                        className="
                            w-full rounded-xl py-2 ps-8 pe-3
                            bg-bgPrimary border border-borderPrimary
                            text-[13px] text-textPrimary
                            placeholder:text-textSecondary/40
                            outline-none focus:border-appPrimary/50 focus:ring-1 focus:ring-appPrimary/20
                            transition-colors duration-150
                        "
                        placeholder="Search users…"
                    />
                </div>

                {searchResultList}
            </div>
        </div>
    );
};

export default ChatMenu;