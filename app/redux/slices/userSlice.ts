import { User } from '@/lib/models/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: User[] = [];

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            state.push(action.payload);
        },
        addUsers: (state, action: PayloadAction<User[]>) => {
            const existingUserIds = new Set(state.map(user => user?.id));
            const newUsers = action.payload.filter(user => !existingUserIds.has(user?.id));
            state.push(...newUsers);
        },
        deleteUser: (state, action: PayloadAction<Number>) => {
            const index = state.findIndex(user => (user && user.id) == action.payload);
            if(index === -1) return;
            state.splice(index, 1);
        },
        setUsers: (state, action: PayloadAction<User[]>) => action.payload
    },
});

export const { addUser, addUsers, deleteUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
