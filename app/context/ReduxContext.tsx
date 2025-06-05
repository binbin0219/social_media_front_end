"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@/redux/store';
import { User } from '@/lib/models/user';
import { NotificationState } from '@/redux/slices/notificationSlice';
import { initialState as initialChatState } from '@/redux/slices/chatSlice';
import { Post } from '@/lib/models/post';

interface StoreProviderProps {
    children: ReactNode;
    initialPosts: Post[],
    currentUser: User,
    notifications: NotificationState,
    allUnreadMessagesCount: number
}

const StoreProvider = ({ children, initialPosts, currentUser, notifications, allUnreadMessagesCount}: StoreProviderProps) => {
    const store = createStore({
        post: initialPosts ?? [] as Post[], 
        currentUser, 
        notifications,
        chat: {
            ...initialChatState,
            allUnreadCount: allUnreadMessagesCount
        }
    })
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
