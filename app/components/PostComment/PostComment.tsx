import React from 'react'
import UserIcon from '../UserIcon/UserIcon'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { PostComment as PostCommentType } from '@/lib/models/comment'
import FriendshipStatusCompact from '../FriendshipStatus/FriendshipStatusCompact'

type props = {
    comment: PostCommentType
}

const PostComment = React.memo(({ comment }: props) => {
    const currentUser = useSelector((state: RootState) => state.currentUser)!;
    const user = comment.user;
    const isAuthor = currentUser?.id === user?.id;

    return (
        <div className='w-full flex gap-2.5 items-start'>
            <UserIcon userId={user!.id} updatedAt={user?.updatedAt} />
            <div className={`
                p-2.5 px-3.5 rounded-tr-xl rounded-b-xl flex flex-col gap-1.5 max-w-[85%]
                border border-borderPrimary
                ${isAuthor
                    ? 'bg-appPrimary/10 border-appPrimary/20'
                    : 'bg-bgSecondary'}
            `}>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-[13px] font-medium text-textPrimary">
                        {user?.username ?? 'Unknown user'}
                    </span>
                    {isAuthor && (
                        <span className="text-[11px] px-1.5 py-px rounded-full bg-appPrimary/15 text-appPrimary font-medium">
                            You
                        </span>
                    )}
                    <span className="text-[11px] text-textSecondary/70">
                        {timeAgo(comment?.createAt.split(' ')[0])}
                    </span>
                    <FriendshipStatusCompact userId={user!.id} friendship={user?.friendship}/>
                </div>
                <p className="text-[13px] text-textPrimary leading-relaxed break-words">
                    {comment?.content.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>{line}<br /></React.Fragment>
                    ))}
                </p>
            </div>
        </div>
    );
});

PostComment.displayName = 'PostComment';
export default PostComment