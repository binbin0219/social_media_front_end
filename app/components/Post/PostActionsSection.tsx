import { CreateEditPost, Post } from "@/lib/models/post";
import { User } from "@/lib/models/user";
import { disableBtn, enableBtn } from "@/lib/utils/client";
import { addToast } from "@/redux/slices/toastSlice";
import { RootState } from "@/redux/store";
import { RefObject, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementLikeCount as incrementCurrentUserLikeCount, decrementLikeCount as decrementCurrentUserLikeCount } from "@/redux/slices/currentUserSlice";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { useDialogContext } from "@/context/DialogContext";
import CreatePostForm from "../CreatePostForm/CreatePostForm";

type Props = {
    post: Post;
    commentExpanded: boolean;
    handleToggleCommentExpand: () => void;
    handleLikeCountUpdate: (newLikeCount: number) => void;
    handleSharePost: (post: Post) => void;
}

export default function PostActionsSection({ 
    post, 
    commentExpanded, 
    handleToggleCommentExpand, 
    handleLikeCountUpdate, 
    handleSharePost 
}: Props) {
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const currentUser: User = useSelector((state: RootState) => state.currentUser);
    const likeBtnRef = useRef<HTMLButtonElement>(null);
    const shareBtnRef = useRef<HTMLButtonElement>(null);

    const [likeState, setLikeState] = useState({ liked: post?.liked });

    const disableBtnFor1s = (element: RefObject<HTMLButtonElement | null>) => {
        disableBtn(element);
        setTimeout(() => enableBtn(element), 1000);
    }

    // ── Like ────────────────────────────────────────────────────────────────
    const likeOnclickHandler = async () => {
        try {
            disableBtn(likeBtnRef);
            toggleLikeState();
            await sendLikeToServer();
        } catch (error) {
            console.log(error);
            dispatch(addToast({ type: 'error', message: "Failed to like post!" }));
            toggleLikeState();
        } finally {
            disableBtnFor1s(likeBtnRef);
        }
    }
    const toggleLikeState = () => {
        const isLiked = !likeState.liked;
        setLikeState({ liked: isLiked });
        if (isLiked) {
            if (post.user?.id == currentUser?.id) dispatch(incrementCurrentUserLikeCount());
            handleLikeCountUpdate(post.likeCount + 1);
        } else {
            if (post.user?.id == currentUser?.id) dispatch(decrementCurrentUserLikeCount());
            handleLikeCountUpdate(Math.max(post.likeCount - 1, 0));
        }
    }

    const sendLikeToServer = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/like/post`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                post_id: post.id,
                action: likeState.liked ? 'unlike' : 'like'
            })
        });
        if (!res.ok) throw new Error('Failed to send like to server');
        return await res.json();
    }

    // ── Share ───────────────────────────────────────────────────────────────
    const shareOnClickHandler = () => {
        dialog.open(
            null,
            <CreatePostForm
                onCancel={dialog.close}
                shareMode={{
                    originalPost: post,
                    onShare: handleShareSubmit,
                }}
            />
        );
    };
    const handleShareSubmit = async (payload: CreateEditPost) => {
        try {
            const post = await sendShareToServer(payload);
            handleSharePost?.(post);
            dispatch(addToast({ type: 'success', message: 'Post shared!' }));
            dialog.close();
        } catch (error) {
            console.error(error);
            dispatch(addToast({ type: 'error', message: 'Failed to share post!' }));
        }
    };
    const sendShareToServer = async (payload: CreateEditPost) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                originalPostId: post.id,
                content: payload.content.trim() || null,
                privacySetting: payload.privacySetting,
                commentStatus: payload.commentStatus,
                isSensitive: payload.isSensitive,
                selectedFriendIds: payload.selectedFriends.map(f => f.id),
            })
        });
        if (!res.ok) throw new Error('Failed to share post');
        return await res.json();
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <>
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
                    <Heart size={17} fill={likeState.liked ? 'currentColor' : 'none'} style={{ pointerEvents: 'none' }} />
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
                    <MessageCircle size={17} fill={commentExpanded ? 'currentColor' : 'none'} style={{ pointerEvents: 'none' }} />
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

                {/* Share */}
                {post.user?.id !== currentUser?.id && (
                    <button
                        ref={shareBtnRef}
                        onClick={shareOnClickHandler}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                            text-textSecondary hover:bg-bgHoverPrimary transition-colors duration-150"
                    >
                        <Repeat2 size={17} style={{ pointerEvents: 'none' }} />
                        <span>Share</span>
                        {post.shareCount > 0 && (
                            <span className="text-xs px-1.5 py-px rounded-full font-medium bg-bgHoverSecondary text-textSecondary">
                                {post.shareCount}
                            </span>
                        )}
                    </button>
                )}
            </div>
        </>
    );
}