import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = {
    type: "success" | "error" | "info";
    message: string;
};

const initialState: ToastType[] = [];

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast(state, action : PayloadAction<ToastType>) {
            state.push(action.payload);
        },
        deleteToast(state, action : PayloadAction<ToastType>) {
            const index = state.findIndex(toast => toast == action.payload);
            if(index === -1) return;
            state.splice(index, 1);
        }
    }
});

export const {addToast, deleteToast} = toastSlice.actions;
export default toastSlice.reducer