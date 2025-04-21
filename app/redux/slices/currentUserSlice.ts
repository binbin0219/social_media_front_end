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
        }
    }
});

export const {setCurrentUser, updateCoverUrl, updateProfile} = currentUserSlice.actions;
export default currentUserSlice.reducer;