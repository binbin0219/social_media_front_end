import { deleteNotifWithCountById } from "@/redux/slices/notificationSlice";
import { useDispatch } from "react-redux";

export function useDeleteNotification() {
    const dispatch = useDispatch();

    return (notificationId: number) => {
        dispatch(deleteNotifWithCountById(notificationId));
    };
}
