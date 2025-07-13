import { apiAgent } from "@/lib/api-agent";
import { Notification } from "../models/notification";

const deleteNotificationOnServer = async (notificationId: number) => {
    const response = await apiAgent.fetchOnClient(`/api/notification/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            notificationId
        })
    });
    if(!response.ok) {
        throw new Error("Failed to reject friend request");
    }
    const data = await response.json();
    return data;
}

const fetchNotifications = async (offset: number) => {
    const response = await apiAgent.fetchOnClient(`/api/notification/get?offset=${offset}&recordPerPage=6`);
    if(!response.ok) {
        throw new Error("Failed to fetch notifications");
    }
    const data = await response.json();
    const seenNotifications: Notification[] = data.seenNotifications;
    const unseenNotifications: Notification[] = data.unseenNotifications;
    return {seenNotifications, unseenNotifications}
}

export const notifService = {
    deleteNotificationOnServer,
    fetchNotifications
}