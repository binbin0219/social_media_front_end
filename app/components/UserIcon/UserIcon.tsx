"use client";
import { getUserAvatarLink } from '@/lib/services/user';
import React, { CSSProperties } from 'react';
import SmartImage from '../SmartImage';
import { defaultUserAvatar } from '@/lib/constants';

type Props = {
    userId: number;
    updatedAt?: string;
    width?: number | string;
    height?: number | string;
    navigateToUserProfile?: boolean;
    className?: string;
    position?: CSSProperties['position'];
};

const UserIcon = ({
    userId,
    updatedAt,
    width = 45,
    height = 45,
    navigateToUserProfile = true,
    className,
    position
}: Props) => {

    const handleOnclick = () => {
        if (userId) {
        window.location.href = `/user/profile/${userId}`;
        } else {
        alert('User profile not available');
        }
    };

    return (
        <SmartImage
            onClick={navigateToUserProfile ? handleOnclick : undefined}
            className={`rounded-full hover:opacity-50 cursor-pointe ${className}`}
            src={getUserAvatarLink(userId, updatedAt)}
            fallbackSrc={defaultUserAvatar}
            width={width}
            height={height}
            alt="User Icon"
            position={position}
        />
    );
};

export default UserIcon;