import { Post } from "@/lib/models/post";
import { User } from "@/lib/models/user";
import { disableBtn, enableBtn } from "@/lib/utils/client";
import { addToast } from "@/redux/slices/toastSlice";
import { RootState } from "@/redux/store";
import { RefObject, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementLikeCount as incrementCurrentUserLikeCount, decrementLikeCount as decrementCurrentUserLikeCount } from "@/redux/slices/currentUserSlice";
import { Heart, MessageCircle } from "lucide-react";

type Props = {
    post: Post;
    commentExpanded: boolean;
    handleToggleCommentExpand: () => void;
    handleLikeCountUpdate: (newLikeCount: number) => void;
}

export default function PostActionsSection({ post, commentExpanded, handleToggleCommentExpand, handleLikeCountUpdate }: Props) {
    const dispatch = useDispatch();
    const currentUser : User = useSelector((state: RootState) => state.currentUser);
    const likeBtnRef = useRef<HTMLButtonElement>(null);
    const [likeState, setLikeState] = useState({
        liked: post?.liked,
    })
    
    const likeOnclickHandler = async () => {
        try {
            disableBtn(likeBtnRef);
            toggleLikeState();
            await sendLikeToServer();
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                type: 'error',
                message: "Failed to like post!"
            }));
            toggleLikeState();
        } finally {
            disableBtnFor1s(likeBtnRef);
        }
    }
    
    const disableBtnFor1s = (element: RefObject<HTMLButtonElement | null>) => {
        disableBtn(element);
        setTimeout(() => {
            enableBtn(element);
        }, 1000);
    }

    const toggleLikeState = () => {
        const isLiked = !likeState.liked;
        setLikeState({ liked: isLiked });
        if(isLiked === true) {
            if(post.user?.id == currentUser?.id) {
                dispatch(incrementCurrentUserLikeCount());
            }
            handleLikeCountUpdate(post.likeCount + 1);
        } else {
            if(post.user?.id == currentUser?.id) {
                dispatch(decrementCurrentUserLikeCount());
            }
            handleLikeCountUpdate(Math.max(post.likeCount - 1, 0));
        }
    }
    
    const sendLikeToServer = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/like/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                post_id: post.id,
                action: likeState.liked ? 'unlike' : 'like'
            })
        });
        if(!res.ok) throw new Error('Failed to send like to server');
        return await res.json();
    }

    return (
        <div className="flex gap-1 items-center">

            {/* Like */}
            <button
                ref={likeBtnRef}
                onClick={likeOnclickHandler}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                    transition-colors duration-150
                    ${likeState.liked
                        ? 'text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20'
                        : 'text-textSecondary hover:bg-bgHoverPrimary'}
                `}
            >
                <Heart
                    size={17}
                    fill={likeState.liked ? 'currentColor' : 'none'}
                    style={{ pointerEvents: 'none' }}
                />
                <span>{likeState.liked ? 'Liked' : 'Like'}</span>
                {post.likeCount > 0 && (
                    <span className={`
                        text-xs px-1.5 py-px rounded-full font-medium
                        ${likeState.liked
                            ? 'bg-red-100 text-red-500 dark:bg-red-500/20'
                            : 'bg-bgHoverSecondary text-textSecondary'}
                    `}>
                        {post.likeCount}
                    </span>
                )}
            </button>

            {/* Comment */}
            <button
                onClick={handleToggleCommentExpand}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                    transition-colors duration-150
                    ${commentExpanded
                        ? 'text-appPrimary bg-appPrimary/10 hover:bg-appPrimary/15'
                        : 'text-textSecondary hover:bg-bgHoverPrimary'}
                `}
            >
                <MessageCircle
                    size={17}
                    fill={commentExpanded ? 'currentColor' : 'none'}
                    style={{ pointerEvents: 'none' }}
                />
                <span>Comments</span>
                {post.commentCount > 0 && (
                    <span className={`
                        text-xs px-1.5 py-px rounded-full font-medium
                        ${commentExpanded
                            ? 'bg-appPrimary/15 text-appPrimary'
                            : 'bg-bgHoverSecondary text-textSecondary'}
                    `}>
                        {post.commentCount}
                    </span>
                )}
            </button>
        </div>
    )
}