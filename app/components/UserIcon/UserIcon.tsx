"use client"
import React, { useEffect } from 'react'

type Props = {
    userId? : number,
    userAvatar?: string | null
}

const UserIcon = ({userId, userAvatar} : Props) => {
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
        className="w-[45px] h-[45px] rounded-full" 
        src={userAvatarSrc ?? "/assets/default_avatar.png"} 
        alt="User Icon" 
        onError={({ currentTarget }) => { 
            currentTarget.onerror = null; 
            currentTarget.src = "/assets/default_avatar.png" 
        }} />
    )
}

export default UserIcon