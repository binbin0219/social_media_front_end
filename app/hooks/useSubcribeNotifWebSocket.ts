import { useWebSocket } from "@/context/WebSocketContext";
import { addNotification } from "@/redux/slices/notificationSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useSubcribeNotifWebSocket(isNotifDropdownOpen: boolean) {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();

    useEffect(() => {
        if(connected && client) {
            const sub = client.subscribe('/user/queue/notifications', (msg) => {
                const notification = JSON.parse(msg.body);
                dispatch(addNotification(notification));
            })

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch])

    useEffect(() => {
        if (!client || !client.connected) {
            console.warn("Failed to open notification on server: client is disconnected!");
            return;
        };

        if (isNotifDropdownOpen) {
            client.publish({
                destination: '/app/notification.open'
            });
        } else {
            client.publish({
                destination: '/app/notification.close'
            });
        }
    }, [isNotifDropdownOpen, client, connected]);
}