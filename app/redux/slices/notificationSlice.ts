import { Notification } from '@/lib/models/notification';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
    seenNotificationCount: number,
    unseenNotificationCount: number,
    data: Record<number, Notification>;
}

export const initialState: NotificationState = {
    seenNotificationCount: 0,
    unseenNotificationCount: 0,
    data: {}
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.data[action.payload.id] = action.payload;
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
                if(!notif.seen) {
                    state.unseenNotificationCount--;
                } else {
                    state.seenNotificationCount--;
                }
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
                notif.seen ? state.seenNotificationCount-- : state.unseenNotificationCount--;
                delete state.data[notif.id];
            }
        },
        decrementUnseenNotifCount: (state) => {
            state.unseenNotificationCount--;
        }
    },
});

export const { addNotification, addNotifications, deleteNotification, deleteNotifWithCountById, deleteFriendRequestNotifWithCount, decrementUnseenNotifCount } = notificationSlice.actions;
export default notificationSlice.reducer;
