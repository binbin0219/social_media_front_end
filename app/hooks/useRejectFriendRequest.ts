import { useDispatch } from "react-redux";
import { updateFriendship } from "../redux/slices/userSlice";
import { Friendship } from "@/lib/models/friendship";

export function useRejectFriendRequest() {
    const dispatch = useDispatch();

    return (friendship: Friendship | undefined) => {
        if (friendship && friendship.userId) {
            const updatedFriendship: Friendship = {
                ...friendship,
                status: "REJECTED",
            };
            dispatch(
                updateFriendship({
                    userId: friendship.userId,
                    newFriendship: updatedFriendship,
                })
            );
        }
    };
}
