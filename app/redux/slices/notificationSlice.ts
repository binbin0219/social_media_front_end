import { Notification } from '@/lib/models/notification';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
    newNotificationCount: number,
    data: Record<number, Notification>;
    isOpen: boolean;
}

export const initialState: NotificationState = {
    newNotificationCount: 0,
    data: {},
    isOpen: false
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.data[action.payload.id] = action.payload;

            if(!state.isOpen) {
                state.newNotificationCount++;
            }
        },
        addNotifications: (state, action: PayloadAction<Notification[]>) => {
            action.payload.forEach(notification => {
                if (!(notification.id in state.data)) {
                    state.data[notification.id] = notification;
                }
            });
        },
        deleteNotification: (state, action: PayloadAction<number>) => {
            delete state.data[action.payload];
        },
        deleteNotifWithCountById: (state, action: PayloadAction<number>) => {
            const notif = state.data[action.payload];
            if(notif) {
                delete state.data[action.payload];
            }
        },
        deleteFriendRequestNotifWithCount: (state, action: PayloadAction<{
            senderId: number;
            recipientId: number;
        }>) => {
            const {senderId, recipientId} = action.payload;
            const notif = Object.values(state.data).find(
                (notif) => notif.senderId === senderId && notif.recipientId === recipientId
            );
            if(notif) {
                if(!state.isOpen) {
                    state.newNotificationCount--;
                }
                delete state.data[notif.id];
            }
        },
        decrementUnseenNotifCount: (state) => {
            if(state.newNotificationCount > 0) {
                state.newNotificationCount--;
            }
        },
        setIsNotificationOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;

            if(state.isOpen) {
                state.newNotificationCount = 0;
            }
        }
    },
});

export const { addNotification, addNotifications, deleteNotification, deleteNotifWithCountById, deleteFriendRequestNotifWithCount, decrementUnseenNotifCount, setIsNotificationOpen } = notificationSlice.actions;
export default notificationSlice.reducer;
