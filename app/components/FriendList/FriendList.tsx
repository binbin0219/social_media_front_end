"use client"
import { Friend } from '@/lib/models/user';
import { friendshipService } from '@/lib/services/friendship';
import React, { useState } from 'react'
import { IconUserOff } from '@tabler/icons-react';
import DataLoader from '../DataLoader/DataLoader';

type Props = {
    userId: number;
    skeletonContainerClassName?: string;
    onMap: (friend: Friend, index: number) => React.JSX.Element;
}

const FriendList = ({userId, skeletonContainerClassName, onMap}: Props) => {
    const [isFetching, setIsFetching] = useState(false);
    const [isAllDataFetched, setIsAllDataFetched] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);

    const handleDataLoaderVisible = async () => {
        if(isFetching) return;
        setIsFetching(true);

        setTimeout(async () => {
            if(isAllDataFetched) return;
            const fetchedFriends = await friendshipService.fetchFriends(userId, friends.length);
            setIsFetching(false);
            setFriends((prev) => [...prev, ...fetchedFriends]);
            setIsAllDataFetched(fetchedFriends.length < 6);
        }, 500);
    }
    return (
        <div className='flex flex-col gap-2 overflow-y-auto' style={{maxHeight: '400px'}}>
            {friends.map((friend, index) => (
                onMap(friend, index)
            ))}
            {isAllDataFetched && friends.length === 0 && (
                <li className="flex items-center flex-col gap-2 justify-center p-5" style={{minWidth: "250px"}}>
                    <IconUserOff width={50} height={50}/>
                    <p className="font-bold">No friends</p>
                </li>
            )}
            {!isAllDataFetched && (
                <DataLoader onVisible={handleDataLoaderVisible}>
                    <div className={skeletonContainerClassName}>
                        <div className='skeleton' style={{height: '50px'}}></div>
                        <div className='skeleton' style={{height: '50px'}}></div>
                        <div className='skeleton' style={{height: '50px'}}></div>
                    </div>
                </DataLoader>
            )}
        </div>
    )
}

export default FriendList