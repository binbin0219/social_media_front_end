import { NotificationType } from "@/lib/models/notification";

export const acceptFriendRequestOnServer = async (friendId: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/request/accept?friendId=${friendId}`, {credentials: 'include'});
    if(!response.ok) {
        throw new Error("Failed to accept friend request");
    }
    const data = await response.json();
    return data;
}

export const rejectFriendRequestOnServer = async (friendId: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/request/reject?friendId=${friendId}`, {credentials: 'include'});
    if(!response.ok) {
        throw new Error("Failed to reject friend request");
    }
    const data = await response.json();
    return data;
}

export const deleteNotificationOnServer = async (notificationId: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notification/delete`, {
        method: 'DELETE',
        credentials: 'include',
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

export function disableSpaceInputOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ' ') {
        e.preventDefault();
    }
}

export function disableSpaceInputOnPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    if(e.clipboardData) {
        const pastedText = e.clipboardData.getData('text');
        if (pastedText.includes(' ')) {
            e.preventDefault();
        }
    }
}

export function checkIsEmpty(value: string): boolean {
    return value.trim() === "";
}

export function checkIsOnlyCharacter(value: string): boolean {
    const regex = /^[A-Za-z]+$/;
    return regex.test(value);
}

export function checkIsOnlyCharacterAndNumber(value: string): boolean {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(value);
}

export function checkIsValidInputLength(value: string, min: number, max: number): boolean {
    const length = value.trim().length;
    return length >= min && length <= max;
}

export function checkIsBase64Image(str: string): boolean {
    if (typeof str !== 'string') return false;

    const regex = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/]+={0,2}$/;

    if (!regex.test(str)) return false;

    try {
        const base64Data = str.split(',')[1];
        atob(base64Data); // Try decoding to validate
        return true;
    } catch {
        return false;
    }
}