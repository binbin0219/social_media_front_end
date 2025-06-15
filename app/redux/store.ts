import { configureStore } from '@reduxjs/toolkit';
import confDialogReducer, { ConfDialogState } from './slices/confDialogSlice'
import postReducer from './slices/postSlice';
import userReducer from './slices/userSlice';
import chatReducer, { initialState as initialChatState } from './slices/chatSlice';
import toastReducer, { ToastType } from './slices/toastSlice';
import currentUserReducer from './slices/currentUserSlice';
import notificationReducer, { initialState as notificationsInitialState, NotificationState } from './slices/notificationSlice';
import { User } from '@/lib/models/user';
import { ChatState } from './slices/chatSlice';
import { Post } from '@/lib/models/post';

export interface RootState {
    post: Post[];
    user: User[];
    toast: ToastType[];
    currentUser: User;
    notifications: NotificationState;
    chat: ChatState;
    confDialog: ConfDialogState
}

export function createStore(preloadedState: Partial<RootState>) {
    return configureStore({
        reducer: {
            post: postReducer,
            user: userReducer,
            toast: toastReducer,
            currentUser: currentUserReducer,
            notifications: notificationReducer,
            chat: chatReducer,
            confDialog: confDialogReducer
        },
        preloadedState: {
            post: preloadedState?.post ?? [],
            currentUser: preloadedState.currentUser ?? {} as User,
            notifications: preloadedState?.notifications ?? notificationsInitialState,
            chat: preloadedState.chat ?? initialChatState
        }
    });
}
