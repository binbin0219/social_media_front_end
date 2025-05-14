import React, { useRef, useState } from 'react'
import Dropdown from '../Dropdown/Dropdown'
import { IconUserOff, IconUsers } from '@tabler/icons-react'
import DropdownItemSkeleton from '../Skeletons/DropdownItemSkeleton'
import DataLoader from '../DataLoader/DataLoader'
import { Friend } from '@/lib/models/user'
import UserIcon from '../UserIcon/UserIcon'
import { fetchFriends } from '@/main'


const FriendListDropdown = () => {
    const noDataRef = useRef<HTMLLIElement>(null);
    const [isAllDataFetched, setIsAllDataFetched] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isOpen , setIsOpen] = useState(false);

    const handleDataLoaderVisible = async () => {
        const fetchedFriends = await fetchFriends(friends.length);
        setFriends((prev) => [...prev, ...fetchedFriends]);
        setIsAllDataFetched(fetchedFriends.length < 6);
    }

    return (
        <Dropdown
        isOpen={isOpen}
        setIsOpen={(isOpen: boolean) => setIsOpen(isOpen)}
        toggleButton={
            <button className='dropdown-toggle'>
                <IconUsers className='nav-bar-icon hover:stroke-slate-300' strokeWidth={2} width={28} height={28}/>
            </button>
        }
        >
            <ul className="dropdown-content relative max-h-[400px] overflow-y-auto" style={{minWidth: "250px"}}>
                <h5 className="font-semibold">Friends</h5>
                {friends.map(friend => (
                    <div key={friend.id} className='dropdown-item flex gap-2 items-center'>
                        <UserIcon userAvatar={friend.avatar} userId={friend.id}/>
                        {friend.username}
                    </div>
                ))}
                {isAllDataFetched && friends.length === 0 && (
                    <li ref={noDataRef} className="dropdown-item flex items-center gap-2 justify-center py-3" style={{minWidth: "250px"}}>
                        <IconUserOff/>
                        <p className="text-sm">No friends</p>
                    </li>
                )}
                {!isAllDataFetched && (
                    <DataLoader onVisible={handleDataLoaderVisible}>
                        <div className='flex gap-3 flex-col w-100'>
                            <DropdownItemSkeleton/>
                            <DropdownItemSkeleton/>
                            <DropdownItemSkeleton/>
                        </div>
                    </DataLoader>
                )}
            </ul>
        </Dropdown>
    )
}

export default FriendListDropdown