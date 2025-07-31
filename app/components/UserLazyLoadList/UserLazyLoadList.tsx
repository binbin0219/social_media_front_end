import { IconArticleOff } from '@tabler/icons-react';
import React, { useState } from 'react'
import UserIcon from '../UserIcon/UserIcon';
import DropdownItemSkeleton from '../Skeletons/DropdownItemSkeleton';
import DataLoader from '../DataLoader/DataLoader';
import { User } from '@/lib/models/user';
import { userService } from '@/lib/services/user';

type Props = {
    username: string;
    onItemClick: (result: User) => void;
    className?: string;
    recordPerPage?: number;
}

const UserLazyLoadList = ({username, className, onItemClick, recordPerPage = 6}: Props) => {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isAllResultFetched, setIsAllResultFetched] = useState(false);

    const handleDataLoaderVisible = (username: string) => {
        setTimeout(async () => {
            const users = await userService.fetchUsersByUsername(
                username,
                searchResults.length,
                recordPerPage
            );

            const uniqueNewUsers = users.filter(
                (newUser) => !searchResults.some(existingUser => existingUser!.id === newUser!.id)
            );

            setSearchResults(prev => [...prev, ...uniqueNewUsers]);
            if (users.length < (recordPerPage)) {
                setIsAllResultFetched(true);
            }
        }, 1000);
    };

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
                <div key={index} onClick={() => onItemClick(result)} className='flex gap-2 items-center list-item-general'>
                    <UserIcon width={45} height={45} updatedAt={result?.updatedAt} userId={result!.id}/>
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