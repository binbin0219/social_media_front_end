"use client"
import { addToast } from '@/redux/slices/toastSlice';
import React, { memo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import PostComment from '../PostComment/PostComment';
import { CommentStatus, Post } from '@/lib/models/post';
import PostCommentSkeleton from '../PostCommentSkeleton/PostCommentSkeleton';
import { autoExpandInputHeight } from '@/main';
import DataLoader from '../DataLoader/DataLoader';
import { useSubcribeCommentWebSocket } from '@/hooks/useSubcribeCommentWebSocket';
import { PostComment as PostCommentType } from '@/lib/models/comment';
import LoadingButton from '../LoadingButton/LoadingButton';
import { Lock, UserPlus, MessageSquareOff, Send } from 'lucide-react';

type Props = {
    post: Post;
    commentStatus: CommentStatus;
    canComment: boolean;
    handleAddComments: (newComments: PostCommentType[]) => void;
    handleSentComment: (newComment: PostCommentType) => void;
}

const statusConfig = {
    OPEN: null,
    CLOSED: {
        icon: <Lock size={14} />,
        label: "Comments are closed",
        sublabel: "The author has disabled comments on this post.",
        inputPlaceholder: "Comments are closed",
    },
    ONLY_FRIENDS: {
        icon: <UserPlus size={14} />,
        label: "Friends only",
        sublabel: "Only friends can comment on this post.",
        inputPlaceholder: "Only friends can comment…",
    },
} as const;

const PostCommentSection = memo(({ post, commentStatus, canComment, handleAddComments, handleSentComment }: Props) => {
    useSubcribeCommentWebSocket(post.id);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const commentListRef = useRef<HTMLDivElement>(null);
    const [isSendingComment, setIsSendingComment] = useState(false);
    const [isAllCommentsFetched, setIsAllCommentsFetched] = useState(false);
    const dispatch = useDispatch();
    const comments : PostCommentType[] = post.comments || [];
    const [commentState, setCommentState] = useState<{
        commentingContent: string;
    }>({
        commentingContent: "",
    });

    const statusInfo = statusConfig[commentStatus];

    const handleSkeletonVisible = async () => {
        try {
            setTimeout(() => {
                if (!isAllCommentsFetched) {
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comment/get?postId=${post.id}&start=${comments.length}&length=4`, {
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
                        handleAddComments(data.comments);
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

    const NoCommentYet = () => (
        <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full bg-bgHoverSecondary flex items-center justify-center">
                <MessageSquareOff size={22} className="text-textSecondary/50" />
            </div>
            <p className="text-sm font-medium text-textSecondary/60">No comments yet</p>
        </div>
    );

    const sendCommentToServer = async (comment: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                post_id: post.id,
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
            handleSentComment(sendedComment);
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
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-[15px] font-medium text-textPrimary">Comments</h5>

                {statusInfo && (
                    <span className={`
                        flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
                        ${commentStatus === 'CLOSED'
                            ? 'bg-red-50 text-red-500 dark:bg-red-500/10'
                            : 'bg-appPrimary/10 text-appPrimary'}
                    `}>
                        {statusInfo.icon}
                        {statusInfo.label}
                    </span>
                )}
            </div>

            <div
                ref={commentListRef}
                className="comment-list w-full mb-4 flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-1"
            >
                {isAllCommentsFetched && comments.length === 0
                    ? <NoCommentYet />
                    : comments.map((comment: PostCommentType) => (
                        <PostComment key={comment.id} comment={comment} />
                    ))
                }

                {isAllCommentsFetched && comments.length !== 0 && (
                    <p className="text-center py-2 text-xs font-medium text-textSecondary/60">
                        No more comments
                    </p>
                )}

                {!isAllCommentsFetched && (
                    <DataLoader onVisible={handleSkeletonVisible}>
                        <PostCommentSkeleton />
                    </DataLoader>
                )}
            </div>

            {/* Status banner — shown only when restricted */}
            {statusInfo && (
                <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl mb-3
                    border
                    ${commentStatus === 'CLOSED'
                        ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-500/10 dark:border-red-500/20'
                        : 'bg-appPrimary/5 border-appPrimary/15 text-appPrimary'}
                `}>
                    <span className="flex-shrink-0">{statusInfo.icon}</span>
                    <p className="text-xs leading-snug">{statusInfo.sublabel}</p>
                </div>
            )}

            {/* Comment input */}
            <div className="relative flex items-end gap-2">
                <textarea
                    ref={commentInputRef}
                    value={commentState.commentingContent}
                    onChange={handleCommentInput}
                    placeholder={statusInfo?.inputPlaceholder ?? "Write your comment…"}
                    rows={1}
                    disabled={!canComment}
                    className={`
                        w-full max-h-[200px] h-auto resize-none
                        border rounded-xl
                        py-2.5 px-3.5 pr-11
                        text-[13px] placeholder:text-textSecondary/50
                        outline-none transition-all duration-150
                        ${!canComment
                            ? 'bg-bgHoverSecondary border-borderPrimary text-textSecondary/40 cursor-not-allowed select-none'
                            : 'bg-bgPrimary border-borderPrimary text-textPrimary focus:border-appPrimary/50 focus:ring-1 focus:ring-appPrimary'}
                    `}
                />
                <LoadingButton
                    type="submit"
                    disabled={!canComment}
                    className={`
                        absolute end-3 bottom-2.5 transition-opacity
                        ${!canComment
                            ? 'text-textSecondary/30 cursor-not-allowed pointer-events-none'
                            : 'text-appPrimary hover:opacity-60'}
                    `}
                    isLoading={isSendingComment}
                    loaderColor="var(--app-color-primary)"
                    onClick={handleCommentSent}
                    text={<Send size={18} style={{ pointerEvents: 'none' }} />}
                />
            </div>
        </div>
    );
});

PostCommentSection.displayName = 'PostCommentSection';
export default PostCommentSection