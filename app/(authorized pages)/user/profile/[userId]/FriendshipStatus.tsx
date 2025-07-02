import Tooltip from '@/components/Tooltip/Tooltip'
import { useAcceptFriendRequest } from '@/hooks/useAcceptFriendRequest'
import { useRejectFriendRequest } from '@/hooks/useRejectFriendRequest'
import { friendshipService } from '@/lib/services/friendship'
import { Friendship } from '@/lib/models/friendship'
import { decrementUnseenNotifCount, deleteNotifWithCountById } from '@/redux/slices/notificationSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { updateFriendship } from '@/redux/slices/userSlice'
import { RootState } from '@/redux/store'
import { IconUserCheck, IconUserExclamation, IconUserX } from '@tabler/icons-react'
import React, { memo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingButton from '@/components/LoadingButton/LoadingButton'
import { useDialogContext } from '@/context/DialogContext'

type Props = {
    friendship?: Friendship,
    profileUserId: number
}

const FriendshipStatus = memo(({profileUserId} : Props) => {
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
    const friendship = useSelector((state: RootState) => state.user.find(user => user?.id == profileUserId)?.friendship);
    const friendReqNotif = useSelector((state: RootState) => {
        return Object.values(state.notifications.data).find(
            (notif) => notif.senderId === profileUserId && notif.recipientId === currentUserId
        );
    });

    if(!friendship) return null;

    const isCurrentUserSender = friendship.userId === currentUserId;
    const isRejected = friendship.status === 'REJECTED';
    const isRejectedByCurrentUser = isRejected && friendship.friendId === currentUserId;
    const isRejectedByOtherUser = isRejected && friendship.friendId === profileUserId;

    const sendFriendRequestOnClient = () => {
        const updatedFriendship: Friendship = { 
            ...friendship, 
            userId: currentUserId!,
            friendId: profileUserId!,
            status: "PENDING"
        };
        dispatch(updateFriendship({
            userId: profileUserId!,
            newFriendship: updatedFriendship
        }));
    }

    const unsendFriendRequestOnServer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/request/unsend?friendId=${profileUserId}`, {
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
        dispatch(updateFriendship({
            userId: profileUserId!,
            newFriendship: updatedFriendship
        }));
    }

    const unfriendOnServer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friendship/unfriend?friendId=${profileUserId}`, {
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
        dispatch(updateFriendship({
            userId: profileUserId!,
            newFriendship: updatedFriendship
        }));
    }

    const addFriendBtnHandler = async () => {
        try {
            if(isSendingFriendReq) return;
            setIsSendingFriendReq(true);
            await friendshipService.sendFriendRequestOnServer(profileUserId);
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
            await friendshipService.acceptFriendRequestOnServer(profileUserId);
            acceptFriendRequestOnClient(friendship);
            if(friendReqNotif) {
                dispatch(deleteNotifWithCountById(friendReqNotif.id));
            } else {
                dispatch(decrementUnseenNotifCount());
            }
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
            await friendshipService.rejectFriendRequestOnServer(profileUserId);
            rejectFriendRequestOnClient(friendship);
            if(friendReqNotif) {
                dispatch(deleteNotifWithCountById(friendReqNotif.id));
            } else {
                dispatch(decrementUnseenNotifCount());
            }
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
        <>
            <Tooltip className={isRejectedByOtherUser ? '' : 'hidden'} text='Friend request rejected' position='bottom'>
                <button type="button" 
                className={`
                    bg-red-200 border-red-400 text-red-600 hover:bg-red-300 border-2 px-3 py-2 rounded-lg mb-1`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-exclamation inline">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.008 .128" />
                        <path d="M19 16v3" />
                        <path d="M19 22v.01" />
                    </svg>
                    {/* Friend request rejected */}
                </button>
            </Tooltip>
            <Tooltip text='Friend request sent' position='bottom' className={friendship.status === 'PENDING' && isCurrentUserSender ? '' : 'hidden'}>
                <button ref={unsendFriendReqBtnRef} id="unsend_request_button" type="button" 
                onClick={() => handleUnsendFriendRequest()}
                className={`
                    bg-green-200 border-green-400 text-green-600 hover:bg-green-300 border-2 px-3 py-2 rounded-lg mb-1
                `}
                >
                    <IconUserCheck/>
                    {/* Friend request sent */}
                </button>
            </Tooltip>
            <div id="reply_friend_request" 
            style={{
                zIndex: 10
            }}
            className={`
                ${friendship.status === 'PENDING' && !isCurrentUserSender ? '' : 'hidden'}
                dropdown
            `}>
                <Tooltip text='Reply friend request' position='bottom'>
                    <button onClick={(event) => handleDropdownToggle(event)} type="button" className="dropdown-toggle bg-cyan-200 border-cyan-400 text-cyan-600 hover:bg-cyan-300 border-2 px-3 py-2 rounded-lg mb-1">
                        {/* Reply friend request */}
                        <IconUserExclamation/>
                    </button>
                </Tooltip>
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
            <Tooltip text='Unfriend' position='bottom' className={friendship.status === 'ACCEPTED' ? '' : 'hidden'}>
                <button ref={unfriendReqBtnRef} id="unfriend_button" type="button" 
                onClick={() => unfriendBtnHandler()}
                className={`
                    bg-red-200 border-red-400 text-red-600 hover:bg-red-300 border-2 px-3 py-2 rounded-lg mb-1
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
            </Tooltip>
            <Tooltip text='Add friend' position='bottom' className={friendship.status === null || isRejectedByCurrentUser ? '' : 'hidden'}>
                <LoadingButton
                className='bg-sky-200 border-sky-400 text-sky-600 hover:bg-sky-300 border-2 px-3 py-2 rounded-lg mb-1'
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
            </Tooltip>
        </>
    )
});

FriendshipStatus.displayName = 'FriendshipStatus';
export default FriendshipStatus