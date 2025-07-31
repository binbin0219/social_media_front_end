"use client"
import React, { memo, useRef, useState } from 'react'
import NotificationSkeleton from '../Skeletons/NotificationSkeleton';
import Notification from '../Notification/Notification';
import NotificationCounter from './NotificationCounter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addNotifications, setIsNotificationOpen } from '@/redux/slices/notificationSlice';
import { IconBell, IconBellOff } from '@tabler/icons-react';
import Dropdown from '../Dropdown/Dropdown';
import DynamicTooltip from '../Tooltip/DynamicToolTip';
import DataLoader from '../DataLoader/DataLoader';
import { useSubcribeNotifWebSocket } from '@/hooks/useSubcribeNotifWebSocket';
import { notifService } from '@/lib/services/notification';

const NotificationDropdown = memo(() => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.notifications.isOpen);
    const notifications = useSelector((state: RootState) => state.notifications.data);
    const noNotificationRef = useRef<HTMLLIElement>(null);
    const [isAllNotificationFetched, setIsAllNotificationFetched] = useState(false);
    useSubcribeNotifWebSocket(isOpen);

    const handleDataLoaderVisible = async () => {

        setTimeout(async () => {
            if(isAllNotificationFetched) return;

            const {unseenNotifications, seenNotifications} = await notifService.fetchNotifications(Object.keys(notifications).length);
            dispatch(addNotifications(unseenNotifications));
            setIsAllNotificationFetched(
                (unseenNotifications.length + seenNotifications.length) < 6
            );
        }, 500);
    }

    return (
        <Dropdown
            setIsOpen={(isOpen: boolean) => dispatch(setIsNotificationOpen(isOpen))}
            isOpen={isOpen}
            toggleButton={(
                <DynamicTooltip text='Notifications'>
                    <button 
                    onClick={() => dispatch(setIsNotificationOpen(!isOpen))} 
                    data-data-loaded="false" 
                    id="notifications_btn" 
                    type="button" 
                    className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <IconBell className='w-6 h-6'/>
                        <NotificationCounter/>
                    </button>
                </DynamicTooltip>
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
                    <DataLoader className='flex flex-col gap-2' onVisible={handleDataLoaderVisible}>
                        <NotificationSkeleton/>
                        <NotificationSkeleton/>
                        <NotificationSkeleton/>
                    </DataLoader>
                : null}
            </ul>
        </Dropdown>
    )
});

NotificationDropdown.displayName = 'NotificationDropdown';
export default NotificationDropdown