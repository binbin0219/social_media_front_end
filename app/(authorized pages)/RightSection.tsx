"use client"
import ChatButton from '@/components/ChatButton'
import FriendList from '@/components/FriendList/FriendList'
import RecommendedUserList from '@/components/RecommendedUserList/RecommendedUserList'
import UserIcon from '@/components/UserIcon/UserIcon'
import { RootState } from '@/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

const RightSection = () => {
    const {id: currentUserId, friendCount} = useSelector((state: RootState) => state.currentUser!);
    const containerRef = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState<undefined | number>(undefined);
    const [height, setHeight] = useState<undefined | number>(undefined);
    const [shouldHide, setShouldHide] = useState(true);

    useEffect(() => {
        if(containerRef.current) {
            setTop(containerRef.current.getBoundingClientRect().top);
        }
    }, [shouldHide])

    useEffect(() => {
        const handleResize = () => {
            if (top !== undefined) {
                const newHeight = window.innerHeight - top;
                setHeight(newHeight);
            }

            setShouldHide(window.innerWidth < 1450);
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [top]);

    return (
        <div
            ref={containerRef}
            className={`w-[350px] ${shouldHide ? 'hidden' : ''}`}
        >
            <div
                className="flex flex-col gap-4 pb-3 sticky overflow-y-auto"
                style={{ top, height }}
            >
                {/* Recommended Users */}
                <div className="w-[275px] relative">
                    <RecommendedUserList limit={5} />
                </div>

                {/* Friends */}
                <div className="w-[275px] relative bg-bgSecondary border border-borderPrimary rounded-lg p-2">
                    <p className="font-bold text-textPrimary">
                        Friends ({friendCount})
                    </p>

                    <FriendList
                        userId={currentUserId}
                        skeletonContainerClassName="flex gap-3 flex-col w-full"
                        onMap={(friend) => (
                            <div
                                key={friend.id}
                                className="flex gap-2 items-center list-item-general hover:bg-bgHoverPrimary rounded p-2"
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <UserIcon
                                        userId={friend.id}
                                        updatedAt={friend.updatedAt}
                                        storyUser={friend}
                                        stories={friend.stories}
                                    />
                                    <p className="text-sm text-textSecondary">
                                        {friend.username}
                                    </p>
                                </div>

                                <ChatButton targetUserId={friend.id} />
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default RightSection