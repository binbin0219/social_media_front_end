import React, { useRef, useState } from 'react'
import Dropdown from '../Dropdown/Dropdown'
import { IconUserOff, IconUsers } from '@tabler/icons-react'
import DropdownItemSkeleton from '../Skeletons/DropdownItemSkeleton'
import DataLoader from '../DataLoader/DataLoader'
import { Friend } from '@/lib/models/user'
import UserIcon from '../UserIcon/UserIcon'
import UserProfileLink from '../Link/UserProfileLink'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import DynamicTooltip from '../Tooltip/DynamicToolTip'
import { friendshipService } from '@/lib/services/friendship'


const FriendListDropdown = () => {
    const noDataRef = useRef<HTMLLIElement>(null);
    const currentUserId = useSelector((state: RootState) => state.currentUser!.id);
    const [isAllDataFetched, setIsAllDataFetched] = useState(false);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isOpen , setIsOpen] = useState(false);

    const handleDataLoaderVisible = async () => {
        setTimeout(async () => {
            const fetchedFriends = await friendshipService.fetchFriends(currentUserId, friends.length);
            setFriends((prev) => [...prev, ...fetchedFriends]);
            setIsAllDataFetched(fetchedFriends.length < 6);
        }, 500);
    }

    return (
        <Dropdown
        isOpen={isOpen}
        setIsOpen={(isOpen: boolean) => setIsOpen(isOpen)}
        toggleButton={
            <DynamicTooltip text='Friends' className='flex'>
                <button className='dropdown-toggle p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors' onClick={() => setIsOpen(!isOpen)}>
                    <IconUsers className='h-6 w-6'/>
                </button>
            </DynamicTooltip>
        }
        >
            <ul className="dropdown-content relative max-h-[400px] overflow-y-auto" style={{minWidth: "250px"}}>
                <h5 className="font-semibold">Friends</h5>
                {friends.map(friend => (
                    <UserProfileLink key={friend.id} userId={friend.id}>
                        <div className='dropdown-item flex gap-2 items-center'>
                            <UserIcon updatedAt={friend.updatedAt} userId={friend.id}/>
                            {friend.username}
                        </div>
                    </UserProfileLink>
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