"use client"
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

const NotificationCounter = () => {
    const newNotificationCount = useSelector((state: RootState) => state.notifications.newNotificationCount);

    return (
        <div id="notification_count" className={`${newNotificationCount === 0 && 'hidden'} absolute pointer-events-none top-[-3px] right-[-5px] w-[19px] h-[19px] flex items-center justify-center bg-white rounded-full`}>
            <div className="bg-red-500 w-[15px] h-[15px] flex items-center justify-center rounded-full text-xs text-white">{newNotificationCount ?? 0}</div>
        </div>
    )
}

export default NotificationCounter