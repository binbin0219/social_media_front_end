"use client"
import { addToast } from '@/redux/slices/toastSlice';
import React, { memo, useRef, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PostComment from '../PostComment/PostComment';
import { Post } from '@/lib/models/post';
import { RootState } from '@/redux/store';
import { addComments, sendComment } from '@/redux/slices/postSlice';
import PostCommentSkeleton from '../PostCommentSkeleton/PostCommentSkeleton';
import { autoExpandInputHeight } from '@/main';
import DataLoader from '../DataLoader/DataLoader';
import { useSubcribeCommentWebSocket } from '@/hooks/useSubcribeCommentWebSocket';
import { PostComment as PostCommentType } from '@/lib/models/comment';
import LoadingButton from '../LoadingButton/LoadingButton';

type Props = {
    postId: number,
}

const PostCommentSection = memo(({postId}: Props) => {
    useSubcribeCommentWebSocket(postId);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const commentListRef = useRef<HTMLDivElement>(null);
    const [isSendingComment, setIsSendingComment] = useState(false);
    const [isAllCommentsFetched, setIsAllCommentsFetched] = useState(false);
    const dispatch = useDispatch();
    const commentIds : number[] = useSelector(
        (state: RootState) => state.post.find((post: Post) => post.id === postId)?.comments.map((comment: PostCommentType) => comment.id) || [],
        shallowEqual
    );
    const [commentState, setCommentState] = useState<{
        commentingContent: string;
    }>({
        commentingContent: "",
    });

    const handleSkeletonVisible = async () => {
        try {
            setTimeout(() => {
                if (!isAllCommentsFetched) {
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comment/get?postId=${postId}&offset=${commentIds.length}&recordPerPage=4`, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    .then(res => {
                        if(!res.ok) {
                            throw new Error("Failed to fetch comments");
                        }
                        return res.json();
                    })
                    .then((data: {
                        isAllFetched: boolean;
                        comments: PostCommentType[]
                    }) => {
                        setIsAllCommentsFetched(data.isAllFetched);
                        dispatch(addComments({
                            postId,
                            comments: data.comments
                        }));
                    })
                }
            }, 500);
        } catch (error) {
            console.log(error);
            addToast({
                type: 'error',
                message: 'Failed to get comments'
            });
        }
    }

    const NoCommentYet = () => {
        return (
            <div className="no-comments-yet w-full flex flex-col items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message-off">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 9h1m4 0h3" />
                    <path d="M8 13h5" />
                    <path d="M8 4h10a3 3 0 0 1 3 3v8c0 .577 -.163 1.116 -.445 1.573m-2.555 1.427h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8c0 -1.085 .576 -2.036 1.439 -2.562" />
                    <path d="M3 3l18 18" />
                </svg>
                <h1 className="text-md font-bold text-center text-gray-500">No comments yet</h1>
            </div>
        )
    }

    const sendCommentToServer = async (comment: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                post_id: postId,
                content: comment
            })
        });
        if(!res.ok) throw new Error('Failed to send comment to server');
        const data = await res.json();
        const uploadedComment = data.comment;
        return uploadedComment as PostCommentType;
    }
    
    const handleCommentSent = async () => {
        try {
            if(!checkIsCommentSentable(commentState.commentingContent)) return;
            if(isSendingComment) return;
            setIsSendingComment(true);
            const sendedComment = await sendCommentToServer(commentState.commentingContent);
            setCommentState(() => ({
                commentingContent: "",
            }));
            dispatch(sendComment({postId, comment: sendedComment}));
            dispatch(addToast({
                type: 'success',
                message: 'Comment sent'
            }));
            
            // Scroll to top after comment sent
            if(commentListRef.current) {
                commentListRef.current.scrollTop = 0;
            }
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                type: 'error',
                message: "Comment couldn't be sent, please try again."
            }));
        } finally {
            setIsSendingComment(false);
        }
    }

    const checkIsCommentSentable = (content : string) : boolean => {
        let isSentable = true;
        const isEmpty = content.trim() === "";
        if(isEmpty) {
            commentInputRef.current?.classList.add('border-red-500');
            isSentable = false;
        } else {
            commentInputRef.current?.classList.remove('border-red-500');
        }
        return isSentable;
    }

    const handleCommentInput = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
        if(isSendingComment) return;
        setCommentState(prevState => ({
            ...prevState,
            commentingContent: event.target.value
        }))
        autoExpandInputHeight(event.target, 200);
    }

    return (
        <div className="post-comment-section mt-1">
            <h5 className="font-bold mb-2">Comments</h5>
            <div ref={commentListRef} className="comment-list w-full mb-3 flex flex-col gap-5 overflow-y-auto max-h-[400px]">
                {isAllCommentsFetched && commentIds.length === 0 ? <NoCommentYet /> : commentIds.map((commentId: number) => {
                    return <PostComment key={commentId.valueOf()} commentId={commentId} postId={postId}/>
                }) }
                {isAllCommentsFetched && commentIds.length !== 0 ? <p className='text-center mt-2 font-bold text-gray-500'>No more comments</p> : null}
                {!isAllCommentsFetched ? 
                    <DataLoader onVisible={handleSkeletonVisible}>
                        <PostCommentSkeleton/>
                    </DataLoader>
                : null}
            </div>
            <div className="w-full flex gap-2 relative">
                <textarea ref={commentInputRef} value={commentState.commentingContent} onChange={(e) => handleCommentInput(e)} placeholder='Write your comment...' className="w-full max-w-[100%] h-auto max-h-[200px] post-comment-input border rounded-lg p-3 pe-8 outline-none resize-none" rows={1}></textarea>
                <LoadingButton
                type='submit'
                className='absolute end-[10px] top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-50'
                isLoading={isSendingComment}
                loaderColor='#9691a5'
                onClick={async () => await handleCommentSent()}
                text={(
                    <svg style={{pointerEvents: "none"}} data-post-action="add-comment" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 14l11 -11" />
                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                    </svg>
                )}
                />
            </div>
        </div>
    )
});

PostCommentSection.displayName = 'PostCommentSection';
export default PostCommentSection