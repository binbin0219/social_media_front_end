import DynamicTooltip from '@/components/Tooltip/DynamicToolTip'
import { useAcceptFriendRequest } from '@/hooks/useAcceptFriendRequest'
import { useRejectFriendRequest } from '@/hooks/useRejectFriendRequest'
import { friendshipService } from '@/lib/services/friendship'
import { Friendship } from '@/lib/models/friendship'
import { decrementUnseenNotifCount, deleteNotifWithCountById } from '@/redux/slices/notificationSlice'
import { addToast } from '@/redux/slices/toastSlice'
// import { updateFriendship } from '@/redux/slices/userSlice'
import { RootState } from '@/redux/store'
import { IconUserCheck, IconUserExclamation, IconUserX } from '@tabler/icons-react'
import React, { memo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingButton from '@/components/LoadingButton/LoadingButton'
import { useDialogContext } from '@/context/DialogContext'

type Props = {
    friendship: Friendship,
    userId: number
}

const FriendshipStatus = memo((props : Props) => {
    const { userId } = props;
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const acceptFriendRequestOnClient = useAcceptFriendRequest();
    const rejectFriendRequestOnClient = useRejectFriendRequest();
    const [isSendingFriendReq, setIsSendingFriendReq] = useState(false);
    const [isAcceptingFriendReq, setIsAcceptingFriendReq] = useState(false);
    const [isRejectingFriendReq, setIsRejectingFriendReq] = useState(false);
    const unsendFriendReqBtnRef = useRef<HTMLButtonElement>(null);
    const unfriendReqBtnRef = useRef<HTMLButtonElement>(null);
    const currentUserId = useSelector((state: RootState) => state.currentUser!.id);
    // const friendship = useSelector((state: RootState) => state.user.find(user => user?.id == userId)?.friendship);
    const [friendship, setFriendShip] = useState<Friendship>(props.friendship);
    const friendReqNotif = useSelector((state: RootState) => {
        return Object.values(state.notifications.data).find(
            (notif) => notif.senderId === userId && notif.recipientId === currentUserId
        );
    });

    if(!friendship) return null;

    const isCurrentUserSender = friendship.userId === currentUserId;
    const isRejected = friendship.status === 'REJECTED';
    const isRejectedByCurrentUser = isRejected && friendship.friendId === currentUserId;
    const isRejectedByOtherUser = isRejected && friendship.friendId === userId;

    const sendFriendRequestOnClient = () => {
        const updatedFriendship: Friendship = { 
            ...friendship, 
            userId: currentUserId!,
            friendId: userId!,
            status: "PENDING"
        };
        setFriendShip(updatedFriendship);
        // dispatch(updateFriendship({
        //     userId: userId!,
        //     newFriendship: updatedFriendship
        // }));
    }

    const unsendFriendRequestOnServer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/request/unsend?friendId=${userId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error("Failed to unsend friend request");
        }
        return await response.json();
    }

    const unsendFriendRequestOnClient = () => {
        const updatedFriendship: Friendship = { ...friendship, status: null};
        setFriendShip(updatedFriendship);
        // dispatch(updateFriendship({
        //     userId: userId!,
        //     newFriendship: updatedFriendship
        // }));
    }

    const unfriendOnServer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/unfriend?friendId=${userId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error("Failed to unfriend");
        }
        return await response.json();
    }

    const unfriendOnClient = () => {
        const updatedFriendship: Friendship = { ...friendship, status: null};
        setFriendShip(updatedFriendship);
        // dispatch(updateFriendship({
        //     userId: userId!,
        //     newFriendship: updatedFriendship
        // }));
    }

    const addFriendBtnHandler = async () => {
        try {
            if(isSendingFriendReq) return;
            setIsSendingFriendReq(true);
            await friendshipService.sendFriendRequestOnServer(userId);
            sendFriendRequestOnClient();
            dispatch(addToast({
                type: 'success',
                message: 'Friend request sent sucessfully'
            }));
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                type: 'error',
                message: 'Failed to send friend request'
            }));
        } finally {
            setIsSendingFriendReq(false);
        }
    }

    const handleUnsendFriendRequest = () => {
        dialog.open(
            "Unsend friend request",
            "Are you sure to unsend friend request?",
            "Confirm",
            async () => {
                try {
                    await unsendFriendRequestOnServer();
                    unsendFriendRequestOnClient();
                    dispatch(addToast({
                        type: 'success',
                        message: 'Friend request unsent successfully'
                    }));
                } catch (error) {
                    console.log(error);
                    dispatch(addToast({
                        type: 'error',
                        message: 'Failed to unsend friend request'
                    }));
                } finally {
                    dialog.close();
                }
            }
        )
    }

    const unfriendBtnHandler = () => {
        dialog.open(
            "Unfriend",
            "Are you sure to unfriend this user?",
            "Confirm",
            async () => {
                try {
                    await unfriendOnServer();
                    unfriendOnClient();
                    dispatch(addToast({
                        type: 'success',
                        message: 'Unfriended successfully'
                    }));
                } catch (error) {
                    console.log(error);
                    dispatch(addToast({
                        type: 'error',
                        message: 'Failed to unfriend'
                    }));
                } finally {
                    dialog.close();
                }
            }
        )
    }

    const handleAcceptFriendRequest = async () => {
        try {
            if(isAcceptingFriendReq) return;
            setIsAcceptingFriendReq(true);
            await friendshipService.acceptFriendRequestOnServer(userId);
            acceptFriendRequestOnClient(friendship);
            if(friendReqNotif) {
                dispatch(deleteNotifWithCountById(friendReqNotif.id));
            } else {
                dispatch(decrementUnseenNotifCount());
            }
            setFriendShip({
                userId: currentUserId!,
                friendId: userId!,
                status: 'ACCEPTED'
            })
            dispatch(addToast({
                message: "Friend request accepted",
                type: "success"
            }))
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                type: 'error',
                message: 'Failed to accept friend request'
            }));
        } finally {
            setIsAcceptingFriendReq(false);
        }
    }

    const handleRejectFriendRequest = async () => {
        try {
            if(isRejectingFriendReq) return;
            setIsRejectingFriendReq(true);
            await friendshipService.rejectFriendRequestOnServer(userId);
            rejectFriendRequestOnClient(friendship);
            if(friendReqNotif) {
                dispatch(deleteNotifWithCountById(friendReqNotif.id));
            } else {
                dispatch(decrementUnseenNotifCount());
            }
            setFriendShip({
                userId: userId!,
                friendId: currentUserId!,
                status: 'REJECTED'
            })
            dispatch(addToast({
                message: "Friend request rejected",
                type: "success"
            }))
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                message: "Failed to reject friend request",
                type: "error"
            }))
        } finally {
            setIsRejectingFriendReq(false);
        }
    }

    return (
        <div>
            <DynamicTooltip className={isRejectedByOtherUser ? '' : 'hidden'} text='Friend request rejected' position='bottom'>
                <button
                type="button" 
                className={`
                bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600
                `}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-exclamation inline">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.008 .128" />
                        <path d="M19 16v3" />
                        <path d="M19 22v.01" />
                    </svg>
                    {/* Friend request rejected */}
                </button>
            </DynamicTooltip>
            <DynamicTooltip text='Friend request sent' position='bottom' className={friendship.status === 'PENDING' && isCurrentUserSender ? '' : 'hidden'}>
                <button ref={unsendFriendReqBtnRef} type="button" 
                onClick={() => handleUnsendFriendRequest()}
                className={`
                    bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600
                `}
                >
                    <IconUserCheck/>
                    {/* Friend request sent */}
                </button>
            </DynamicTooltip>
            <div id="reply_friend_request" 
            style={{
                zIndex: 10
            }}
            className={`
                ${friendship.status === 'PENDING' && !isCurrentUserSender ? '' : 'hidden'}
                dropdown
            `}>
                <DynamicTooltip text='Reply friend request' position='bottom'>
                    <button onClick={(event) => handleDropdownToggle(event)} type="button" className="dropdown-toggle bg-cyan-500 text-white text-sm px-4 py-2 rounded-md hover:bg-cyan-600">
                        {/* Reply friend request */}
                        <IconUserExclamation/>
                    </button>
                </DynamicTooltip>
                <div className="dropdown-menu w-[200px]">
                    <ul className="dropdown-content">
                        <span className='font-bold'>Pending friend request</span>
                        <LoadingButton
                        className='dropdown-item flex justify-start gap-2'
                        isLoading={isAcceptingFriendReq}
                        loaderColor='#9691a5'
                        loaderWidth={24}
                        onClick={() => handleAcceptFriendRequest()}
                        loadingText='Accepting...'
                        text={(
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-check inline">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                                    <path d="M15 19l2 2l4 -4" />
                                </svg>
                                Accept
                            </>
                        )}
                        />
                        <LoadingButton
                        className='dropdown-item flex justify-start gap-2 text-red-500'
                        isLoading={isRejectingFriendReq}
                        loaderColor='#9691a5'
                        loaderWidth={24}
                        onClick={() => handleRejectFriendRequest()}
                        loadingText='Rejecting...'
                        text={(
                            <>
                                <IconUserX/>
                                Reject
                            </>
                        )}
                        />
                    </ul>
                </div>
            </div>
            <DynamicTooltip text='Unfriend' position='bottom' className={friendship.status === 'ACCEPTED' ? '' : 'hidden'}>
                <button ref={unfriendReqBtnRef} type="button" 
                onClick={() => unfriendBtnHandler()}
                className={`
                    bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600
                `}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-x inline">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                        <path d="M22 22l-5 -5" />
                        <path d="M17 22l5 -5" />
                    </svg>
                    {/* Unfriend */}
                </button>
            </DynamicTooltip>
            <DynamicTooltip text='Add friend' position='bottom' className={friendship.status === null || isRejectedByCurrentUser ? '' : 'hidden'}>
                <LoadingButton
                className='bg-sky-500 text-white text-sm px-4 py-2 rounded-md hover:bg-sky-600'
                isLoading={isSendingFriendReq}
                loaderColor='#0284c7'
                loaderWidth={24}
                onClick={() => addFriendBtnHandler()}
                text={(
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-plus inline">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M16 19h6" />
                        <path d="M19 16v6" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                    </svg>
                )}
                />
            </DynamicTooltip>
        </div>
    )
});

FriendshipStatus.displayName = 'FriendshipStatus';
export default FriendshipStatus