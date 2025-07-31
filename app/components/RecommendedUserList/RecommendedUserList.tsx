import { userService } from '@/lib/services/user';
import React, { useState } from 'react'
import DataLoader from '../DataLoader/DataLoader';
import DropdownItemSkeleton from '../Skeletons/DropdownItemSkeleton';
import { RecommendedUsers } from '@/lib/models/user';
import UserIcon from '../UserIcon/UserIcon';
import { IconUserOff } from '@tabler/icons-react';
import FriendshipStatus from '@/(authorized pages)/user/profile/[userId]/FriendshipStatus';

type Props = {
    limit: number;
}

const RecommendedUserList = ({ limit }: Props) => {
    const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUsers[]>([]);
    const [isAllFetched, setIsAllFetched] = useState(false);

    const onVisible = async () => {
        if(isAllFetched) return;
        const userRecommendations = await userService.getRecommendations(limit);
        setRecommendedUsers(userRecommendations);

        // Fetch only one time
        setIsAllFetched(true);
    }

    return (
        <div className='flex flex-col gap-2 p-2 bg-white rounded-lg'>
            <p className='font-bold'>People you might know</p>
            {recommendedUsers.map((recommendedUser, index) => {
                return (
                    <div key={index} className='flex gap-2 items-center list-item-general'>
                        <div className='flex items-center gap-2 flex-1'>
                            <UserIcon userId={recommendedUser.id} updatedAt={recommendedUser.updatedAt}/>
                            <p className='text-sm text-gray-700'>{recommendedUser.username}</p>
                        </div>
                        <FriendshipStatus userId={recommendedUser.id} friendship={{status: null}}/>
                    </div>
                )
            })}
            {isAllFetched && recommendedUsers.length === 0 && (
                <div className='w-full flex flex-col items-center gap-2 p-3'>
                    <IconUserOff width={50} height={50}/>
                </div>
            )}
            {!isAllFetched && (
                <DataLoader className='flex flex-col gap-2' onVisible={onVisible}>
                    <DropdownItemSkeleton/>
                    <DropdownItemSkeleton/>
                    <DropdownItemSkeleton/>
                    <DropdownItemSkeleton/>
                    <DropdownItemSkeleton/>
                </DataLoader>
            )}
        </div>
    )
}

export default RecommendedUserList