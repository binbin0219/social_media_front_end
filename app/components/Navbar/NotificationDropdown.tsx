"use client"
import React, { memo, useEffect, useRef, useState } from 'react'
import NotificationSkeleton from '../Skeletons/NotificationSkeleton';
import type { Notification as NotificationType } from '@/lib/models/notification';
import Notification from '../Notification/Notification';
import NotificationCounter from './NotificationCounter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addNotification, addNotifications, setIsNotificationOpen } from '@/redux/slices/notificationSlice';
import { IconBell, IconBellOff } from '@tabler/icons-react';
import { useWebSocket } from '@/context/WebSocketContext';
import Dropdown from '../Dropdown/Dropdown';
import Tooltip from '../Tooltip/Tooltip';

const NotificationDropdown = memo(() => {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();
    const isOpen = useSelector((state: RootState) => state.notifications.isOpen);
    const notifications = useSelector((state: RootState) => state.notifications.data);
    const NotificationSkeletonRef = useRef<HTMLLIElement>(null);
    const noNotificationRef = useRef<HTMLLIElement>(null);
    const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
    const [isAllNotificationFetched, setIsAllNotificationFetched] = useState(false);
    
    useEffect(() => {
        if(connected && client) {
            const sub = client.subscribe('/user/queue/notifications', (msg) => {
                const notification = JSON.parse(msg.body);
                dispatch(addNotification(notification));
            })

            return () => sub.unsubscribe();
        }
    }, [connected, client])

    useEffect(() => {
        if (!client || !client.connected) {
            console.warn("Failed to open notification on server: client is disconnected!");
            return;
        };

        if (isOpen) {
            client.publish({
                destination: '/app/notification.open'
            });
        } else {
            client.publish({
                destination: '/app/notification.close'
            });
        }
    }, [isOpen, client, connected]);

    useEffect(() => {
        if(!NotificationSkeletonRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsSkeletonVisible(entry.isIntersecting);
            },
            {root: null, threshold: 0.4}
        );

        observer.observe(NotificationSkeletonRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if(isSkeletonVisible) {
            setTimeout(async () => {
                const {unseenNotifications, seenNotifications} = await fetchNotifications();
                dispatch(addNotifications(unseenNotifications));
                setIsAllNotificationFetched(
                    (unseenNotifications.length + seenNotifications.length) < 6
                );
            }, 500);
        }
    }, [isSkeletonVisible])

    const fetchNotifications = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notification/get?offset=0&recordPerPage=6`, {credentials: 'include'});
        if(!response.ok) {
            throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        const seenNotifications: NotificationType[] = data.seenNotifications;
        const unseenNotifications: NotificationType[] = data.unseenNotifications;
        return {seenNotifications, unseenNotifications}
    }

    return (
        <Dropdown
            setIsOpen={(isOpen: boolean) => dispatch(setIsNotificationOpen(isOpen))}
            isOpen={isOpen}
            toggleButton={(
                <Tooltip text='Notifications'>
                    <button onClick={() => dispatch(setIsNotificationOpen(!isOpen))} data-data-loaded="false" id="notifications_btn" type="button" className="flex gap-1 items-center hover:opacity-50">
                        <IconBell className='nav-bar-icon hover:stroke-slate-300' strokeWidth={2} width={28} height={28}/>
                        <NotificationCounter/>
                    </button>
                </Tooltip>
            )}
        >
            <ul id="notification_list" className="dropdown-content relative max-h-[400px] overflow-y-auto" style={{minWidth: "250px"}}>
                <h5 className="font-semibold">Notifications</h5>
                {Object.values(notifications)
                .sort((a, b) => {
                    const dateA = new Date(a.createAt).getTime();
                    const dateB = new Date(b.createAt).getTime();
                    return dateB - dateA; // Descending order
                })
                .map(notification => (
                    <Notification key={notification.id} notification={notification} />
                ))}
                {isAllNotificationFetched && Object.keys(notifications).length === 0 ?
                    <li ref={noNotificationRef} id="no_notification" className="dropdown-item flex items-center gap-2 justify-center py-3" style={{minWidth: "250px"}}>
                        <IconBellOff/>
                        <p className="text-sm">No notifications</p>
                    </li>
                : null}
                {!isAllNotificationFetched ? 
                    <li ref={NotificationSkeletonRef} className='flex flex-col gap-2'>
                        <NotificationSkeleton/>
                        <NotificationSkeleton/>
                        <NotificationSkeleton/>
                    </li>
                : null}
            </ul>
        </Dropdown>
    )
});

export default NotificationDropdown