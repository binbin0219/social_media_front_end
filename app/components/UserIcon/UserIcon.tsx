"use client";
import { getUserAvatarLink } from '@/lib/services/user';
import React, { CSSProperties, useState } from 'react';
import SmartImage from '../SmartImage';
import { defaultUserAvatar } from '@/lib/constants';
import { useStoryViewer } from '@/context/StoryViewerContext';
import { Story } from '@/lib/models/Story';
import { StoryUser } from '@/lib/models/user';

type Props = {
    userId: number;
    updatedAt?: string;
    width?: number | string;
    height?: number | string;
    navigateToUserProfile?: boolean;
    className?: string;
    position?: CSSProperties['position'];
    storyUser?: StoryUser | null;
    stories?: Story[];
    initialStoryIdx?: number | null;
};

const AVATAR_COLORS = [
    '#7C3AED', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444',
];

function avatarColor(userId: number) {
    return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

function getSizeValue(size: number | string) {
    return typeof size === 'string' ? size : `${size}px`;
}

const UserIcon = ({
    userId,
    storyUser,
    updatedAt,
    width = 45,
    height = 45,
    navigateToUserProfile = true,
    className,
    position,
    stories,
    initialStoryIdx,
}: Props) => {
    const [storiesState, setStoriesState] = useState<Story[] | undefined>(stories);
    const { openStoryViewer } = useStoryViewer();
    const hasStories = !!storiesState?.length;
    const allSeen = hasStories && storiesState.every((story) => story.isViewed);

    const handleStoryMarkedViewed = (storyId: number) => {
        setStoriesState((prev) => {
            if(!prev) return [];
            return prev.map((story) => (
                story.id === storyId
                    ? { ...story, isViewed: true }
                    : story
            ));
        })
    }

    const handleOnclick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (hasStories) {
            openStoryViewer({
                user: storyUser ?? storiesState?.[0]?.user ?? null,
                stories: storiesState ?? [],
                initialStoryIdx,
                onStoryMarkedViewed: handleStoryMarkedViewed,
            });
            return;
        }

        if (userId) {
            window.location.href = `/user/profile/${userId}`;
        } else {
            alert('User profile not available');
        }
    };

    const image = (
        <SmartImage
            onClick={(hasStories || navigateToUserProfile) ? (e) => handleOnclick(e) : undefined}
            className={`rounded-full hover:opacity-50 cursor-pointer transition-opacity ${className}`}
            src={getUserAvatarLink(userId, updatedAt)}
            fallbackSrc={defaultUserAvatar}
            width={width}
            height={height}
            alt="User Icon"
            position={hasStories ? 'relative' : position}
        />
    );

    if (!hasStories) return image;

    const color = avatarColor(userId);
    const ringStyle = allSeen
        ? { background: '#9CA3AF', padding: 2.5, borderRadius: '50%' }
        : {
            background: `conic-gradient(${color}, #EC4899, ${color})`,
            padding: 2.5,
            borderRadius: '50%',
        };

    return (
        <div
            style={{
                position,
                width: getSizeValue(width),
                height: getSizeValue(height),
                ...ringStyle,
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2.5px solid var(--bg-secondary)',
                    overflow: 'hidden',
                }}
                className='flex justify-center items-center'
            >
                {image}
            </div>
        </div>
    );
};

export default UserIcon;
