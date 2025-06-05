import { Friendship } from '@/lib/models/friendship';
import { User } from '@/lib/models/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: User[] = [];

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            const index = state.findIndex((user: User) => user?.id === action?.payload?.id);
            if (index !== -1) {
                state[index] = action.payload;
            } else {
                state.push(action.payload);
            }
        },
        addUsers: (state, action: PayloadAction<User[]>) => {
            const existingUserIds = new Set(state.map(user => user?.id));
            const newUsers = action.payload.filter(user => !existingUserIds.has(user?.id));
            state.push(...newUsers);
        },
        deleteUser: (state, action: PayloadAction<number>) => {
            const index = state.findIndex(user => (user && user.id) == action.payload);
            if(index === -1) return;
            state.splice(index, 1);
        },
        updateFriendship: (state, action: PayloadAction<{
            userId: number,
            newFriendship: Friendship
        }>) => {
            const { userId, newFriendship } = action.payload;
            const user = state.find((user) => user?.id === userId);
            if (user) {
                user.friendship = newFriendship;
            }
        },
        setUsers: (state, action: PayloadAction<User[]>) => action.payload
    },
});

export const { addUser, addUsers, deleteUser, setUsers, updateFriendship } = userSlice.actions;
export default userSlice.reducer;
