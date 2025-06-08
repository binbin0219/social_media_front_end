import { IconArticleOff } from '@tabler/icons-react';
import React, { useState } from 'react'
import UserIcon from '../UserIcon/UserIcon';
import DropdownItemSkeleton from '../Skeletons/DropdownItemSkeleton';
import DataLoader from '../DataLoader/DataLoader';
import { User } from '@/lib/models/user';
import { userService } from '@/lib/services/user';

type Props = {
    username: string;
    className?: string;
    onItemClick: (result: User) => void;
}

const UserLazyLoadList = ({username, className, onItemClick}: Props) => {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isAllResultFetched, setIsAllResultFetched] = useState(false);

    const handleDataLoaderVisible = (username: string) => {
        setTimeout(async () => {
            const recordPerPage = 6;
            const users = await userService.fetchUsersByUsername(username, searchResults.length, recordPerPage);

            setSearchResults(prev => [...prev, ...users]);
            if(users.length < 6) {
                setIsAllResultFetched(true);
            }
        }, 1000);
    }

    const NoResults = () => {
        return (
            <div className='flex items-center gap-1 flex-col p-2'>
                <IconArticleOff/>
                <p className='text-sm'>No results</p>
            </div>
        )
    }

    return (
        <div className={className}>
            {isAllResultFetched && searchResults.length === 0 && (
                <NoResults/>
            )}
            {searchResults.map((result, index) => (
                <div key={index} onClick={() => onItemClick(result)} className='dropdown-item flex gap-2 items-center p-2 hover:bg-slate-200 cursor-pointer rounded-lg'>
                    <UserIcon width={45} height={45} userAvatar={result?.avatar} userId={result?.id}/>
                    <p className='text-sm'>{result?.username}</p>
                </div>
            ))}
            {!isAllResultFetched && (
                <DataLoader onVisible={() => handleDataLoaderVisible(username)}>
                    <div className='flex gap-3 flex-col w-100'>
                        <DropdownItemSkeleton/>
                        <DropdownItemSkeleton/>
                        <DropdownItemSkeleton/>
                    </div>
                </DataLoader>
            )}
        </div>
    )
}

export default UserLazyLoadList