"use client"
import React, { useEffect } from 'react'

type Props = {
    userId? : number,
    userAvatar?: string | null,
    width?: number | string;
    height?: number | string;
}

const UserIcon = ({userId, userAvatar, width = 45, height = 45} : Props) => {
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
        style={{
            width: typeof width === 'string' ? width : `${width}px`,
            height: typeof height === 'string' ? height : `${height}px`
        }}
        className={` rounded-full hover:opacity-50 cursor-pointer`} 
        src={userAvatarSrc ?? "/assets/default_avatar.png"} 
        alt="User Icon" 
        onError={({ currentTarget }) => { 
            currentTarget.onerror = null; 
            currentTarget.src = "/assets/default_avatar.png" 
        }} />
    )
}

export default UserIcon