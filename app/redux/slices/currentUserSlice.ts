import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/models/user";

const initialState = {} as User;
const defaultCoverUrl = 'https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid';

const currentUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        setCurrentUser: (state, action : PayloadAction<User>) => action.payload,
        updateCoverUrl: (state, action: PayloadAction<string | undefined | null>) => {
            if(!state) throw new Error("Current user not found when upading cover url");
            state.coverUrl = action.payload ?? defaultCoverUrl;
        },
        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state) {
                Object.assign(state, action.payload);
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

export const {setCurrentUser, updateCoverUrl, updateProfile, incrementPostCount, decrementPostCount, incrementLikeCount, decrementLikeCount} = currentUserSlice.actions;
export default currentUserSlice.reducer;