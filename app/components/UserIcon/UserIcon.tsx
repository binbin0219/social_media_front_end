"use client"
import React, { useEffect } from 'react'

type Props = {
    userId? : number,
    userAvatar?: string | null,
    width?: number;
    height?: number;
}

const UserIcon = ({userId, userAvatar, width, height} : Props) => {
    const defaultWidth = 45;
    const defaultHeight = 45;
    const finalWidth = width || defaultWidth;
    const finalHeight = height || defaultHeight;
    const userAvatarSrc = userAvatar ? userAvatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    const handleOnclick = () => {
        if (userId) {
            window.location.href = `/user/profile/${userId}`;
        } else {
            alert('User profile not available');
        }
    }
    return (
        <img 
        onClick={handleOnclick} 
        className={`w-[${finalWidth}px] h-[${finalHeight}px] rounded-full`} 
        src={userAvatarSrc ?? "/assets/default_avatar.png"} 
        alt="User Icon" 
        onError={({ currentTarget }) => { 
            currentTarget.onerror = null; 
            currentTarget.src = "/assets/default_avatar.png" 
        }} />
    )
}

export default UserIcon