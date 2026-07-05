"use client"
import { useAcceptFriendRequest } from '@/hooks/useAcceptFriendRequest'
import { useRejectFriendRequest } from '@/hooks/useRejectFriendRequest'
import type { Notification as NotificationType, NotificationType as NotificationTypes } from '@/lib/models/notification'
import { User } from '@/lib/models/user'
import { deleteNotifWithCountById } from '@/redux/slices/notificationSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { RootState } from '@/redux/store'
import { Heart, MessageCircle, UserPlus, Check, X, Trash2 } from 'lucide-react'
import React, { JSX, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserIcon from '../UserIcon/UserIcon'
import { useDeleteNotification } from '@/hooks/useDeleteNotification'
import { friendshipService } from '@/lib/services/friendship'
import { notifService } from '@/lib/services/notification'
import LoadingButton from '../LoadingButton/LoadingButton'

type Props = {
    notification: NotificationType;
}

const Notification = ({ notification }: Props) => {
    const friendship = useSelector((state: RootState) =>
        state.user.find((user: User) => user?.id == notification.senderId)?.friendship
    );
    const acceptFriendRequestOnClient = useAcceptFriendRequest();
    const rejectFriendRequestOnClient = useRejectFriendRequest();
    const deleteNotificationOnClient = useDeleteNotification();
    const dispatch = useDispatch();
    const [isAcceptingFriendReq, setIsAcceptingFriendReq] = useState(false);
    const [isRejectingFriendReq, setIsRejectingFriendReq] = useState(false);
    const [isDeletingNotification, setIsDeletingNotification] = useState(false);

    const notificationIconConfig: Record<NotificationTypes, { icon: JSX.Element; bg: string }> = {
        LIKE: {
            icon: <Heart size={11} className="fill-white stroke-white" />,
            bg: "bg-red-500",
        },
        COMMENT: {
            icon: <MessageCircle size={11} className="fill-white stroke-white" />,
            bg: "bg-appPrimary",
        },
        FRIEND_REQUEST: {
            icon: <UserPlus size={11} className="stroke-white" />,
            bg: "bg-appSecondary",
        },
    };

    const notificationContent: Record<NotificationTypes, JSX.Element> = {
        FRIEND_REQUEST: (
            <><span className="font-bold text-textPrimary">{notification.senderUsername}</span>{" "}
            <span className="text-textSecondary">sent you a friend request</span></>
        ),
        COMMENT: (
            <><span className="font-bold text-textPrimary">{notification.senderUsername}</span>{" "}
            <span className="text-textSecondary">commented on your post</span>{" "}
            {notification.content && <span className="font-bold text-textPrimary">{notification.content}</span>}</>
        ),
        LIKE: (
            <><span className="font-bold text-textPrimary">{notification.senderUsername}</span>{" "}
            <span className="text-textSecondary">liked your post</span>{" "}
            {notification.content && <span className="font-bold text-textPrimary">{notification.content}</span>}</>
        ),
    };

    const handleDeleteNotification = async () => {
        try {
            if (isDeletingNotification) return;
            setIsDeletingNotification(true);
            await notifService.deleteNotificationOnServer(notification.id);
            deleteNotificationOnClient(notification.id);
            dispatch(addToast({ message: "Notification deleted", type: "success" }));
        } catch {
            dispatch(addToast({ message: "Failed to delete notification", type: "error" }));
        } finally {
            setIsDeletingNotification(false);
        }
    };

    const handleAcceptFriendRequest = async () => {
        try {
            if (isRejectingFriendReq || isAcceptingFriendReq) return;
            setIsAcceptingFriendReq(true);
            await friendshipService.acceptFriendRequestOnServer(notification.senderId);
            acceptFriendRequestOnClient(friendship);
            dispatch(deleteNotifWithCountById(notification.id));
            dispatch(addToast({ message: "Friend request accepted", type: "success" }));
        } catch {
            dispatch(addToast({ message: "Failed to accept friend request", type: "error" }));
        } finally {
            setIsAcceptingFriendReq(false);
        }
    };

    const handleRejectFriendRequest = async () => {
        try {
            if (isRejectingFriendReq || isAcceptingFriendReq) return;
            setIsRejectingFriendReq(true);
            await friendshipService.rejectFriendRequestOnServer(notification.senderId);
            rejectFriendRequestOnClient(friendship);
            dispatch(deleteNotifWithCountById(notification.id));
            dispatch(addToast({ message: "Friend request rejected", type: "success" }));
        } catch {
            dispatch(addToast({ message: "Failed to reject friend request", type: "error" }));
        } finally {
            setIsRejectingFriendReq(false);
        }
    };

    const iconConfig = notificationIconConfig[notification.type];
    const actionBtn = "w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-150";

    return (
        <div className={`
            flex gap-3 items-start px-3 py-2.5 rounded-xl
            transition-colors duration-150
            hover:bg-bgHoverSecondary cursor-pointer
            ${!notification.seen
                ? 'bg-appPrimary/5 dark:bg-appPrimary/10'
                : 'bg-transparent'}
        `}>
            {/* Avatar + type badge */}
            <div className="relative flex-shrink-0">
                <UserIcon
                    userId={notification.senderId}
                    width={40}
                    height={40}
                />
                <span className={`
                    absolute -bottom-0.5 -right-0.5
                    w-4 h-4 rounded-full
                    flex items-center justify-center
                    ring-2 ring-bgSecondary
                    ${iconConfig.bg}
                `}>
                    {iconConfig.icon}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-[13px] leading-snug">
                    {notificationContent[notification.type]}
                </p>
                <span className="text-[11px] font-medium text-appPrimary">
                    {timeAgo(notification.createAt)}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {notification.type === 'FRIEND_REQUEST' && (
                    <>
                        <LoadingButton
                            className={`${actionBtn} text-textSecondary/50 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10`}
                            isLoading={isRejectingFriendReq}
                            loaderWidth={14}
                            loaderColor="#9691a5"
                            onClick={handleRejectFriendRequest}
                            text={<X size={14} />}
                        />
                        <LoadingButton
                            className={`${actionBtn} text-textSecondary/50 hover:bg-appPrimary/10 hover:text-appPrimary`}
                            isLoading={isAcceptingFriendReq}
                            loaderWidth={14}
                            loaderColor="var(--app-color-primary)"
                            onClick={handleAcceptFriendRequest}
                            text={<Check size={14} />}
                        />
                    </>
                )}

                {(notification.type === 'LIKE' || notification.type === 'COMMENT') && (
                    <LoadingButton
                        className={`${actionBtn} text-textSecondary/50 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10`}
                        isLoading={isDeletingNotification}
                        loaderWidth={14}
                        loaderColor="#9691a5"
                        onClick={handleDeleteNotification}
                        text={<Trash2 size={14} />}
                    />
                )}
            </div>
        </div>
    );
};

export default Notification;
