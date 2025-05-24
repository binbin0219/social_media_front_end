import DataLoader from '@/components/DataLoader/DataLoader';
import UserProfileLink from '@/components/Link/UserProfileLink';
import DropdownItemSkeleton from '@/components/Skeletons/DropdownItemSkeleton';
import UserIcon from '@/components/UserIcon/UserIcon';
import { Friend, User } from '@/lib/models/user';
import { fetchFriends } from '@/main';
import { IconUserOff } from '@tabler/icons-react';
import React, { useState } from 'react'

type Props = {
    profileUser: User;
}

const FriendsSection = ({profileUser}: Props) => {
    const [isAllDataFetched, setIsAllDataFetched] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);

    const handleDataLoaderVisible = async () => {
        setTimeout(async () => {
            const fetchedFriends = await fetchFriends(profileUser!.id, friends.length);
            setFriends((prev) => [...prev, ...fetchedFriends]);
            setIsAllDataFetched(fetchedFriends.length < 6);
        }, 500);
    }

    return (
        <div id="friends_section" className="w-full mt-4 flex flex-col hidden relative border rounded-lg bg-white">
            <h5 className="font-bold text-2xl p-3 border-b">Friends</h5>
            {friends.map(friend => (
                <UserProfileLink key={friend.id} userId={friend.id}>
                    <div className='flex gap-3 items-center p-3 hover:bg-slate-100 cursor-pointer border-b'>
                        <UserIcon userAvatar={friend.avatar} userId={friend.id}/>
                        <p className='font-bold'>{friend.username}</p>
                    </div>
                </UserProfileLink>
            ))}
            {isAllDataFetched && friends.length === 0 && (
                <li className="flex items-center flex-col gap-2 justify-center p-5" style={{minWidth: "250px"}}>
                    <IconUserOff width={50} height={50}/>
                    <p className="font-bold">No friends</p>
                </li>
            )}
            {!isAllDataFetched && (
                <DataLoader onVisible={handleDataLoaderVisible}>
                    <div className='flex gap-3 flex-col w-100 p-3'>
                        <DropdownItemSkeleton/>
                        <DropdownItemSkeleton/>
                        <DropdownItemSkeleton/>
                    </div>
                </DataLoader>
            )}
        </div>
    )
}

export default FriendsSection