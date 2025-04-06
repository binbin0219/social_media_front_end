"use client"
import React, { memo, useEffect, useRef, useState } from 'react'
import NotificationSkeleton from '../Skeletons/NotificationSkeleton';
import type { Notification as NotificationType } from '@/lib/models/notification';
import Notification from '../Notification/Notification';
import NotificationCounter from './NotificationCounter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addNotifications } from '@/redux/slices/notificationSlice';

const NotificationDropdown = memo(() => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.notifications.data);
    const NotificationSkeletonRef = useRef<HTMLLIElement>(null);
    const noNotificationRef = useRef<HTMLLIElement>(null);
    const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
    const [isAllNotificationFetched, setIsAllNotificationFetched] = useState(false);

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

    const handleNotificationBtn = async () => {
        const notification_count = document.getElementById('notification_count');
        if(notification_count) notification_count.classList.add('hidden');
    }

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
        <div className="dropdown">
            <button data-data-loaded="false" id="notifications_btn" type="button" className="flex gap-1 items-center dropdown-toggle hover:opacity-50">
                <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bell fill-slate-200 stroke-slate-400 hover:stroke-slate-300">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
                <NotificationCounter/>
            </button>
            <div className="dropdown-menu">
                <ul id="notification_list" className="dropdown-content relative max-h-[400px] overflow-y-auto" style={{minWidth: "250px"}}>
                    <h5 className="font-semibold">Notifications</h5>
                    {Object.values(notifications).map(notification => (
                        <Notification key={notification.id} notification={notification} />
                    ))}
                    {isAllNotificationFetched && Object.keys(notifications).length === 0 ?
                        <li ref={noNotificationRef} id="no_notification" className="dropdown-item flex items-center gap-2 justify-center py-3" style={{minWidth: "250px"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bell-x">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M13 17h-9a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6a2 2 0 1 1 4 0a7 7 0 0 1 4 6v2" />
                                <path d="M9 17v1a3 3 0 0 0 4.194 2.753" />
                                <path d="M22 22l-5 -5" />
                                <path d="M17 22l5 -5" />
                            </svg>
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
            </div>
        </div>
    )
});

export default NotificationDropdown