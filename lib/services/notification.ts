import { apiAgent } from "@/lib/api-agent";

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

export const notifService = {
    deleteNotificationOnServer
}