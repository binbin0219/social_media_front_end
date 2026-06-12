import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { friendshipService } from '@/lib/services/friendship'
import { Friendship } from '@/lib/models/friendship'
import { decrementUnseenNotifCount, deleteNotifWithCountById } from '@/redux/slices/notificationSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { useAcceptFriendRequest } from '@/hooks/useAcceptFriendRequest'
import { useRejectFriendRequest } from '@/hooks/useRejectFriendRequest'
import { useDialogContext } from '@/context/DialogContext'
import { RootState } from '@/redux/store'

export const useFriendshipActions = (userId: number, initialFriendship?: Friendship) => {
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const acceptFriendRequestOnClient = useAcceptFriendRequest();
    const rejectFriendRequestOnClient = useRejectFriendRequest();

    const [friendship, setFriendship] = useState<Friendship>({
        userId: initialFriendship?.userId ?? null,
        friendId: initialFriendship?.friendId ?? null,
        status: initialFriendship?.status ?? null,
        createAt: initialFriendship?.createAt ?? null,
    });
    const [isSendingFriendReq, setIsSendingFriendReq] = useState(false);
    const [isAcceptingFriendReq, setIsAcceptingFriendReq] = useState(false);
    const [isRejectingFriendReq, setIsRejectingFriendReq] = useState(false);

    const currentUserId = useSelector((state: RootState) => state.currentUser!.id);
    const friendReqNotif = useSelector((state: RootState) =>
        Object.values(state.notifications.data).find(
            (notif) => notif.senderId === userId && notif.recipientId === currentUserId
        )
    );

    const isCurrentUserSender = friendship.userId === currentUserId;
    const isRejected = friendship.status === 'REJECTED';
    const isRejectedByCurrentUser = isRejected && friendship.friendId === currentUserId;
    const isRejectedByOtherUser = isRejected && friendship.friendId === userId;

    const handleAddFriend = async () => {
        try {
            if (isSendingFriendReq) return;
            setIsSendingFriendReq(true);
            await friendshipService.sendFriendRequestOnServer(userId);
            setFriendship({ ...friendship, userId: currentUserId!, friendId: userId!, status: 'PENDING' });
            dispatch(addToast({ type: 'success', message: 'Friend request sent successfully' }));
        } catch {
            dispatch(addToast({ type: 'error', message: 'Failed to send friend request' }));
        } finally {
            setIsSendingFriendReq(false);
        }
    };

    const handleUnsendFriendRequest = () => {
        dialog.open(
            'Unsend friend request',
            'Are you sure you want to unsend this friend request?',
            'Confirm',
            async () => {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/request/unsend?friendId=${userId}`, {
                        method: 'GET', credentials: 'include'
                    });
                    setFriendship({ ...friendship, status: null });
                    dispatch(addToast({ type: 'success', message: 'Friend request unsent' }));
                } catch {
                    dispatch(addToast({ type: 'error', message: 'Failed to unsend friend request' }));
                } finally {
                    dialog.close();
                }
            }
        );
    };

    const handleAcceptFriendRequest = async () => {
        try {
            if (isAcceptingFriendReq) return;
            setIsAcceptingFriendReq(true);
            await friendshipService.acceptFriendRequestOnServer(userId);
            acceptFriendRequestOnClient(friendship);
            if (friendReqNotif) {
                dispatch(deleteNotifWithCountById(friendReqNotif.id));
            } else {
                dispatch(decrementUnseenNotifCount());
            }
            setFriendship({ userId: currentUserId!, friendId: userId!, status: 'ACCEPTED' });
            dispatch(addToast({ type: 'success', message: 'Friend request accepted' }));
        } catch {
            dispatch(addToast({ type: 'error', message: 'Failed to accept friend request' }));
        } finally {
            setIsAcceptingFriendReq(false);
        }
    };

    const handleRejectFriendRequest = async () => {
        try {
            if (isRejectingFriendReq) return;
            setIsRejectingFriendReq(true);
            await friendshipService.rejectFriendRequestOnServer(userId);
            rejectFriendRequestOnClient(friendship);
            if (friendReqNotif) {
                dispatch(deleteNotifWithCountById(friendReqNotif.id));
            } else {
                dispatch(decrementUnseenNotifCount());
            }
            setFriendship({ userId: userId!, friendId: currentUserId!, status: 'REJECTED' });
            dispatch(addToast({ type: 'success', message: 'Friend request rejected' }));
        } catch {
            dispatch(addToast({ type: 'error', message: 'Failed to reject friend request' }));
        } finally {
            setIsRejectingFriendReq(false);
        }
    };

    const handleUnfriend = () => {
        dialog.open(
            'Unfriend',
            'Are you sure you want to unfriend this user?',
            'Confirm',
            async () => {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/unfriend?friendId=${userId}`, {
                        method: 'GET', credentials: 'include'
                    });
                    setFriendship({ ...friendship, status: null });
                    dispatch(addToast({ type: 'success', message: 'Unfriended successfully' }));
                } catch {
                    dispatch(addToast({ type: 'error', message: 'Failed to unfriend' }));
                } finally {
                    dialog.close();
                }
            }
        );
    };

    return {
        friendship,
        canBeFriend: userId !== currentUserId,
        isCurrentUserSender,
        isRejectedByCurrentUser,
        isRejectedByOtherUser,
        isSendingFriendReq,
        isAcceptingFriendReq,
        isRejectingFriendReq,
        handleAddFriend,
        handleUnsendFriendRequest,
        handleAcceptFriendRequest,
        handleRejectFriendRequest,
        handleUnfriend,
    };
};