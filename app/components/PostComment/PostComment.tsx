import React from 'react'
import UserIcon from '../UserIcon/UserIcon'
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { PostComment as PostCommentType } from '@/lib/models/comment'

type props = {
    commentId: number,
    postId: number
}

const PostComment = React.memo(({commentId, postId}: props) => {
    const currentUser = useSelector((state: RootState) => state.currentUser)!;
    const comment = useSelector(
        (state: RootState) => state.post.find(post => post.id === postId)?.comments.find((comment: PostCommentType) => comment.id === commentId),
        shallowEqual
    );
    const user = comment?.user;
    const isAuthor = currentUser?.id === user?.id;
    return (
        <div className='w-full flex gap-2'>
            <UserIcon userId={user!.id} updatedAt={user?.updatedAt} />
            <div className="p-2 bg-slate-100 rounded-lg flex flex-col gap-2 max-w-[85%]">
                <div className="flex flex-col">
                    <p className="comment-user-name font-bold">{user ? user.username : "Unknown user"} {isAuthor ? '(You)' : ''}</p>
                    <p className="comment-time text-xs">{timeAgo(comment?.createAt.split(' ')[0])}</p>
                </div>
                <p className="comment-content text-sm max-w-[]" style={{wordWrap: "break-word"}}>
                    {comment?.content.split("\n").map((line: string, index: number) => (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </div>
    )
})

PostComment.displayName = 'PostComment';
export default PostComment