"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@/redux/store';
import { PostWithUser } from '@/lib/models/post';
import { User } from '@/lib/models/user';
import { NotificationState } from '@/redux/slices/notificationSlice';

interface StoreProviderProps {
    children: ReactNode;
    initialPosts: PostWithUser[],
    currentUser: User,
    notifications: NotificationState
}

const StoreProvider = ({ children, initialPosts, currentUser, notifications}: StoreProviderProps) => {
    const store = createStore({
        post: initialPosts ?? [] as PostWithUser[], 
        currentUser, 
        notifications
    })
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
