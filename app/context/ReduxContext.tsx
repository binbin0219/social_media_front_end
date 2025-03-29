"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@/redux/store';
import { PostWithUser } from '@/lib/models/post';
import { User } from '@/lib/models/user';

interface StoreProviderProps {
    children: ReactNode;
    initialPosts?: PostWithUser[],
    currentUser: User
}

const StoreProvider = ({ children, initialPosts, currentUser}: StoreProviderProps) => {
    const store = createStore({post: initialPosts, currentUser})
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
