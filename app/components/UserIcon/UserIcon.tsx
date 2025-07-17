"use client"
import Image from 'next/image';
import React from 'react'

type Props = {
    userId? : number,
    userAvatar?: string | null,
    width?: number | string;
    height?: number | string;
    navigateToUserProfile?: boolean;
    className?: string;
}

const UserIcon = ({userId, userAvatar, width = 45, height = 45, navigateToUserProfile = true, className} : Props) => {
    const userAvatarSrc = userAvatar && userAvatar.trim() !== "" ? userAvatar : '/assets/default_avatar.png';
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
        src={userAvatarSrc} 
        alt="User Icon" 
        />
    )
}

export default UserIcon