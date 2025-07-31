import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/models/user";

const initialState = {} as User;

const currentUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        setCurrentUser: (state, action : PayloadAction<User>) => action.payload,
        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if(action.payload) {
                action.payload.updatedAt = new Date().toISOString();
            }
            
            if (state) {
                Object.assign(state, action.payload);
            }
        },
        updateDes: (state, action: PayloadAction<string>) => {
            if (state) {
                state.description = action.payload;
            }
        },
        incrementPostCount: (state) => {
            if(state?.postCount) {
                state.postCount++;
            } else {
                state!.postCount = 1;
            }
        },
        decrementPostCount: (state) => {
            if(state?.postCount) {
                const newPostCount = state.postCount - 1;
                state.postCount = Math.max(newPostCount, 0);
            }
        },
        incrementLikeCount: (state) => {
            if(state?.likeCount) {
                state.likeCount++;
            } else {
                state!.likeCount = 1;
            }
        },
        decrementLikeCount: {
            reducer: (state, action: PayloadAction<{ count?: number }>) => {
                const count = action?.payload?.count ?? 1;

                    if(state?.likeCount) {
                        const newLikeCount = state.likeCount - count;
                        state.likeCount = Math.max(newLikeCount, 0);
                    }
            },
            prepare: (payload?: { count?: number }) => {
                return { payload: payload ?? {} };
            }
        }
    }
});

export const {
    setCurrentUser, 
    updateProfile, 
    updateDes,
    incrementPostCount, 
    decrementPostCount, 
    incrementLikeCount, 
    decrementLikeCount
} = currentUserSlice.actions;
export default currentUserSlice.reducer;