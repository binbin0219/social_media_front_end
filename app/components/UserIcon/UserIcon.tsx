"use client"
import { getUserAvatarLink } from '@/lib/services/user';
import Image from 'next/image';
import React from 'react'

type Props = {
    userId : number,
    updatedAt?: string,
    width?: number | string;
    height?: number | string;
    navigateToUserProfile?: boolean;
    className?: string;
}

const UserIcon = ({userId, updatedAt, width = 45, height = 45, navigateToUserProfile = true, className} : Props) => {
    const avatarUrl = getUserAvatarLink(userId, updatedAt);

    const handleOnclick = () => {
        if (userId) {
            window.location.href = `/user/profile/${userId}`;
        } else {
            alert('User profile not available');
        }
    }

    return (
        <Image 
        onClick={navigateToUserProfile ? handleOnclick : () => {}} 
        width={typeof width === 'string' ? parseInt(width) : width}
        height={typeof height === 'string' ? parseInt(height) : height}
        style={{
            width: typeof width === 'string' ? width : `${width}px`,
            height: typeof height === 'string' ? height : `${height}px`
        }}
        className={` rounded-full hover:opacity-50 cursor-pointer ${className}`} 
        src={avatarUrl} 
        alt="User Icon" 
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/assets/default_avatar.png';
        }}
        />
    )
}

export default UserIcon