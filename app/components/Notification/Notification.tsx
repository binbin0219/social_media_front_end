"use client"
import { useAcceptFriendRequest } from '@/hooks/useAcceptFriendRequest'
import { useRejectFriendRequest } from '@/hooks/useRejectFriendRequest'
import type { Notification as NotificationType, NotificationType as NotificationTypes } from '@/lib/models/notification'
import { User } from '@/lib/models/user'
import { acceptFriendRequestOnServer, rejectFriendRequestOnServer } from '@/main'
import { deleteNotifWithCountById } from '@/redux/slices/notificationSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { RootState } from '@/redux/store'
import { IconCheck, IconX } from '@tabler/icons-react'
import React, { JSX } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Props = {
    notification: NotificationType,
}

const Notification = ({notification} : Props) => {
    const friendship = useSelector((state: RootState) => state.user.find((user: User) => user?.id == notification.senderId)?.friendship);
    const acceptFriendRequestOnClient = useAcceptFriendRequest();
    const rejectFriendRequestOnClient = useRejectFriendRequest();
    const dispatch = useDispatch();
    
    const notificationIcons: Record<NotificationTypes, () => JSX.Element> = {
        "like": function () {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart absolute bottom-0 right-0 stroke-red-600 fill-red-600">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
        },
        "comment": function () {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message absolute bottom-0 right-0 fill-sky-300 stroke-sky-300">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 9h8" />
                <path d="M8 13h6" />
                <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
            </svg>
        },
        "FRIEND_REQUEST": function () {
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-plus absolute bottom-0 right-0 fill-red-500 stroke-red-500">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
            </svg>
        }
    }

    const renderIcon = (type: NotificationTypes) => {
        return notificationIcons[type]();
    };

    const FriendRequestButtons = () => {
        return (
            <>
                <button onClick={() => handleRejectFriendRequest()} type="button" className="reject-friend-btn flex gap-1 items-center rounded-lg px-2 py-1 border-2 border-red-300 bg-red-100 text-sm text-red-600">
                    <IconX width={16} height={16}/>
                </button>
                <button onClick={() => handleAcceptFriendRequest()} type="button" className="accept-friend-btn flex gap-1 items-center rounded-lg px-2 py-1 border-2 border-green-300 bg-green-100 text-sm text-green-600">
                    <IconCheck width={16} height={16}/>
                </button>
            </>
        )
    }

    const LikeButtons = () => {
        return (
            <>
                <button type="button" className="delete-notification-btn flex gap-1 items-center rounded-lg px-2 py-1 border-2 border-red-300 bg-red-100 text-sm text-red-600">
                    <IconX width={16} height={16}/>
                </button>
                <button type="button" className="mark-as-read-btn flex gap-1 items-center rounded-lg px-2 py-1 border-2 border-green-300 bg-green-100 text-sm text-green-600">
                    <IconCheck width={16} height={16}/>
                </button>
            </>
        )
    }

    const content: Record<NotificationTypes, () => JSX.Element> = {
        "FRIEND_REQUEST": function () {
            return <><b>{notification.senderFirstName} {notification.senderLastName}</b> sent you a friend request</>
        },
        "comment": function () {
            return <><b>{notification.senderFirstName} {notification.senderLastName}</b> commented on your post</>
        },
        "like": function () {
            return <><b>{notification.senderFirstName} {notification.senderLastName}</b> liked your post</>
        },
    }

    const handleAcceptFriendRequest = async () => {
        try {
            await acceptFriendRequestOnServer(notification.senderId);
            acceptFriendRequestOnClient(friendship);
            dispatch(deleteNotifWithCountById(notification.id));
            dispatch(addToast({
                message: "Friend request accepted",
                type: "success"
            }))
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                message: "Failed to accept friend request",
                type: "error"
            }))
        }
    }

    const handleRejectFriendRequest = async () => {
        try {
            await rejectFriendRequestOnServer(notification.senderId);
            rejectFriendRequestOnClient(friendship);
            dispatch(deleteNotifWithCountById(notification.id));
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
        }
    }

    return (
        <div className={`notification dropdown-item flex gap-2 items-center w-100 ${notification.seen ? '' : 'bg-indigo-100'}`}>
            <div className="relative w-[25%]">
                <img src={notification.senderAvatar} alt="" className="w-[50px] h-[50px] rounded-full"/>
                {renderIcon(notification.type)}
            </div>
            <div className="flex flex-col gap-1 relative w-[75%]">
                <p className="text-sm text-start">{content[notification.type]()}</p>
                <div className="flex justify-between w-full items-end">
                    <p className="font-semibold text-indigo-600 text-xs">{timeAgo(notification.createAt)}</p>
                    {notification.type === "like" ? <LikeButtons/> : ''}
                    {notification.type === "FRIEND_REQUEST" ? <FriendRequestButtons />: ''}
                </div>
            </div>
        </div>
    )
}

export default Notification