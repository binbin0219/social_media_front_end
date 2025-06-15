import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ConfDialogState = {
    isOpen: boolean;
    isLoading: boolean;
    header?: React.ReactNode | string;
    body?: React.ReactNode | string;
    onConfirm?: () => void;
}

export const initialConfDialogState: ConfDialogState = {
    isOpen: false,
    isLoading: false
}

const confDialogSlice = createSlice({
    name: 'confDialog',
    initialState: initialConfDialogState,
    reducers: {
        openConfDialog: (state, action: PayloadAction<{
            header: React.ReactNode | string;
            body: React.ReactNode | string;
            onConfirm: () => void;
        }>) => {
            state.header = action.payload.header;
            state.body = action.payload.body;
            state.onConfirm = action.payload.onConfirm;
            state.isOpen = true;
        },
        closeConfDialog: (state) => {
            if(state.isLoading) {
                console.error("Failed to close conformation dialog: it is in loading state");
                return;
            }

            delete state.header;
            delete state.body;
            delete state.onConfirm;
            state.isOpen = false;
        },
        setConfDialogLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const {
    openConfDialog,
    closeConfDialog,
    setConfDialogLoading
} = confDialogSlice.actions;
export default confDialogSlice.reducer;