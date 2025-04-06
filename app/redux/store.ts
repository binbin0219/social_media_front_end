import { configureStore } from '@reduxjs/toolkit';
import postReducer from './slices/postSlice';
import userReducer from './slices/userSlice';
import toastReducer, { ToastType } from './slices/toastSlice';
import currentUserReducer from './slices/currentUserSlice';
import notificationReducer, { initialState as notificationsInitialState, NotificationState } from './slices/notificationSlice';
import { PostWithUser } from '@/lib/models/post';
import { User } from '@/lib/models/user';

export interface RootState {
    post: PostWithUser[];
    user: User[];
    toast: ToastType[];
    currentUser: User;
    notifications: NotificationState;
}

export function createStore(preloadedState: Partial<RootState>) {
    return configureStore({
        reducer: {
            post: postReducer,
            user: userReducer,
            toast: toastReducer,
            currentUser: currentUserReducer,
            notifications: notificationReducer
        },
        preloadedState: {
            post: preloadedState?.post ?? [],
            currentUser: preloadedState.currentUser ?? {} as User,
            notifications: preloadedState?.notifications ?? notificationsInitialState
        }
    });
}
