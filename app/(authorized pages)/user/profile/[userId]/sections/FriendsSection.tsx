import FriendList from '@/components/FriendList/FriendList';
import UserProfileLink from '@/components/Link/UserProfileLink';
import UserIcon from '@/components/UserIcon/UserIcon';
import { User } from '@/lib/models/user';
import React from 'react'

type Props = {
    profileUser: User;
}

const FriendsSection = ({profileUser}: Props) => {

    return (
        <div id="friends_section" className="w-full mt-4 flex flex-col hidden relative rounded-lg bg-white">
            <h5 className="font-bold text-2xl p-3">Friends</h5>
            <FriendList 
            userId={profileUser!.id}
            skeletonContainerClassName='flex gap-3 flex-col w-100 p-2'
            onMap={(friend) => {
                return (
                    <UserProfileLink key={friend.id} userId={friend.id}>
                        <div className='flex gap-3 items-center p-3 hover:bg-slate-100 cursor-pointer border-t'>
                            <UserIcon updatedAt={friend.updatedAt} userId={friend.id}/>
                            <p className='font-bold'>{friend.username}</p>
                        </div>
                    </UserProfileLink>
                )
            }}
            />
        </div>
    )
}

export default FriendsSection