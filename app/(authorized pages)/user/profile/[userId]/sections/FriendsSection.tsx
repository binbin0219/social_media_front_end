import FriendList from '@/components/FriendList/FriendList';
import UserProfileLink from '@/components/Link/UserProfileLink';
import UserIcon from '@/components/UserIcon/UserIcon';
import { User } from '@/lib/models/user';
import { Users } from 'lucide-react';
import React from 'react'

type Props = {
    profileUser: User;
}

const FriendsSection = ({profileUser}: Props) => {

    return (
        <div id="friends_section" className="w-full mt-4 flex flex-col hidden relative overflow-hidden rounded-2xl bg-bgSecondary border border-borderPrimary text-textPrimary shadow-sm">
            <div className="flex items-center gap-3 border-b border-borderPrimary p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bgHoverPrimary text-appPrimary">
                    <Users size={20} />
                </div>
                <div>
                    <h5 className="font-bold text-xl">Friends</h5>
                    <p className="text-sm text-textPrimary/60">{profileUser.friendCount ?? 0} connections</p>
                </div>
            </div>
            <FriendList 
            userId={profileUser!.id}
            skeletonContainerClassName='flex gap-3 flex-col w-100 p-4'
            onMap={(friend) => {
                return (
                    <UserProfileLink key={friend.id} userId={friend.id}>
                        <div className='flex gap-3 items-center p-4 hover:bg-bgHoverSecondary cursor-pointer border-t border-borderPrimary transition-colors'>
                            <UserIcon updatedAt={friend.updatedAt} userId={friend.id}/>
                            <div className="min-w-0">
                                <p className='truncate font-bold'>{friend.username}</p>
                                <p className="text-sm text-textPrimary/60">View profile</p>
                            </div>
                        </div>
                    </UserProfileLink>
                )
            }}
            />
        </div>
    )
}

export default FriendsSection
