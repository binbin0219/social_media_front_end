"use client"
import React, { memo, RefObject, useRef, useState } from 'react'
import UserIcon from '../UserIcon/UserIcon'
import type { Post } from '@/lib/models/post'
import { useDispatch, useSelector } from 'react-redux'
import './style.css';
import { addToast } from '@/redux/slices/toastSlice'
import PostCommentSection from '../PostCommentSection/PostCommentSection'
import { User } from '@/lib/models/user'
import { RootState } from '@/redux/store'
import { deletePost, updatePost } from '@/redux/slices/postSlice'
import { useRouter } from 'next/navigation'
import { disableBtn, enableBtn } from '@/lib/utils/client'
import { useDialogContext } from '@/context/DialogContext'
import PostAttachments from '../PostAttachments/PostAttachments'
import { IconDotsVertical, IconPencil, IconTrash } from '@tabler/icons-react'
import Dropdown from '../Dropdown/Dropdown'
import PostContent from './PostContent'
import CreatePostForm from '../CreatePostForm/CreatePostForm'
import DynamicTooltip from '../Tooltip/DynamicToolTip'
import { decrementLikeCount, incrementLikeCount } from "@/redux/slices/postSlice";
import { incrementLikeCount as incrementCurrentUserLikeCount, decrementLikeCount as decrementCurrentUserLikeCount, decrementPostCount } from "@/redux/slices/currentUserSlice";
import { Heart, MessageCircle } from 'lucide-react'
import { DropdownItem } from '../NewDropdown/DropdownItem/DropdownItem'

type Props = {
    postId: number,
}

const Post = memo(({ postId: postId }: Props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const likeBtnRef = useRef<HTMLButtonElement>(null);
    const currentUser : User = useSelector((state: RootState) => state.currentUser);
    const post = useSelector((state: RootState) => state.post.find((post: Post) => post.id === postId))!;
    const attachments = post.attachments.map(attachment => ({
        src: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/post/${postId}/attachments/${attachment.id}/data.${attachment.format}`,
        mimeType: attachment.mimeType
    }))
    const isCurrentUserAuthor = currentUser?.id === post?.user?.id;
    const author = post?.user;
    const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState(false);
    const [commentExpanded, setCommentExpanded] = useState(false);
    const [likeState, setLikeState] = useState({
        liked: post?.liked,
    })

    if(!post) {
        console.error(`Failed to render post with id ${postId}: not found`);
        return null;
    }

    const handleOpenCreatePostDialog = () => {
        dialog.open(
            'Edit post',
            <CreatePostForm 
            onCancel={dialog.close} 
            onSubmit={handleSubmit} 
            enableAttachment={false}
            initialData={{
                title: post.title,
                content: post.content
            }}
            />,
        )
    }

    const handleSubmit = async (title: string, content: string) => {
        try {
            await updatePostToServer(title, content);
            dispatch(updatePost({
                postId: postId,
                content: content,
                title: title
            }))
            dispatch(addToast({
                type: 'success',
                message: 'Post updated'
            }));
            dialog.close();
        } catch (error) {
            dialog.close();
            console.log(error);
            dispatch(addToast({
                type: 'error',
                message: 'Failed to update post'
            }));
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

    const updatePostToServer = async (title: string, content: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/update/${post.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                content,
                title
            })
        });
        if(!response.ok) throw new Error('Failed to send like to server');
        return await response.json();
    }

    const deletePostFromServer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/delete?postId=${postId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if(!response.ok) throw new Error('Failed to delete comment');
        return await response.json();
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
            dispatch(incrementLikeCount({postId}));
        } else {
            if(post.user?.id == currentUser?.id) {
                dispatch(decrementCurrentUserLikeCount());
            }
            dispatch(decrementLikeCount({postId}));
        }
    }

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

    const commentExpandOnclickHandler = () => {
        setCommentExpanded(!commentExpanded);
    }

    const deleteBtnHandler = () => {
        dialog.open(
            'Delete Post',
            `Are you sure to delete this post?`,
            'Delete',
            async () => {
                try {
                    await deletePostFromServer();
                    dispatch(deletePost(postId));
                    dispatch(decrementPostCount());
                    dispatch(decrementCurrentUserLikeCount({count: post.likeCount}));
                    dispatch(addToast({
                        type: 'success',
                        message: 'Post deleted successfully'
                    }));
                } catch (error) {
                    console.log(error);
                    dispatch(addToast({
                        type: 'error',
                        message: 'Failed to delete post'
                    }));
                } finally {
                    dialog.close();
                }
            }
        )
    }

    return (
        <div
            className={`
                post relative w-full rounded-xl p-3
                flex flex-col gap-2
                bg-bgSecondary
                border border-borderPrimary
                text-textPrimary
                ${post.isNew ? 'post-new' : ''}
            `}
            data-comment-expanded={commentExpanded}
        >
            {/* Options */}
            {isCurrentUserAuthor && (
                <div
                    className="absolute end-0 top-0 mt-2 me-2"
                    style={{ zIndex: 10 }}
                >
                    <Dropdown
                        toggleButton={
                            <button className="text-textSecondary hover:opacity-70 transition-opacity duration-200">
                                <IconDotsVertical />
                            </button>
                        }
                        setIsOpen={(isOpen: boolean) =>
                            setIsOptionsDropdownOpen(isOpen)
                        }
                        isOpen={isOptionsDropdownOpen}
                    >
                        <DropdownItem
                            onClick={handleOpenCreatePostDialog}
                            className="flex gap-2 items-center"
                        >
                            <IconPencil />
                            Edit
                        </DropdownItem>

                        <DropdownItem
                            onClick={deleteBtnHandler}
                            className="flex gap-2 items-center text-red-500"
                        >
                            <IconTrash />
                            Delete
                        </DropdownItem>
                    </Dropdown>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 cursor-pointer">
                    <UserIcon
                        userId={author!.id}
                        updatedAt={author?.updatedAt}
                    />

                    <div className="flex flex-col">
                        <h4
                            onClick={() =>
                                router.push(`/user/profile/${author?.id}`)
                            }
                            className="font-bold hover:underline text-textPrimary"
                        >
                            {author?.username ?? "Unknown"}{' '}
                            {isCurrentUserAuthor ? '(You)' : ''}
                        </h4>

                        <DynamicTooltip
                            className="w-fit"
                            text={new Date(post.create_at).toLocaleString()}
                        >
                            <h6 className="text-sm text-textSecondary hover:underline">
                                {timeAgo(post.create_at)}
                            </h6>
                        </DynamicTooltip>
                    </div>
                </div>

                {/* Title */}
                <h1
                    className="post-title font-bold mt-3 break-words text-textPrimary"
                >
                    {post.title}
                </h1>

                {/* Content */}
                <PostContent content={post.content} />

                {/* Attachments */}
                {attachments.length > 0 && (
                    <PostAttachments attachments={attachments} />
                )}
            </div>

            {/* Actions */}
            <div className="mt-2">
                <div className="buttons flex gap-2 mt-2 rounded-lg items-center w-fit">

                    {/* Like */}
                    <button
                        ref={likeBtnRef}
                        onClick={() => likeOnclickHandler()}
                        className={`
                            flex gap-2 p-2 rounded-lg transition
                            ${likeState.liked
                                ? 'hover:bg-red-100'
                                : 'hover:bg-bgHoverPrimary'}
                        `}
                    >
                        {likeState.liked ? (
                            <Heart
                                size={24}
                                fill="currentColor"
                                className="text-red-500"
                                style={{ pointerEvents: 'none' }}
                            />
                        ) : (
                            <Heart
                                size={24}
                                className="text-red-500"
                                style={{ pointerEvents: 'none' }}
                            />
                        )}

                        <div className="flex gap-2 items-center">
                            <p
                                className={
                                    likeState.liked
                                        ? 'text-red-500'
                                        : 'text-textSecondary'
                                }
                            >
                                {likeState.liked ? 'Liked' : 'Like'}
                            </p>

                            <p
                                className={`
                                    px-4 rounded-2xl
                                    ${likeState.liked
                                        ? 'bg-red-100 text-red-500'
                                        : 'bg-bgSecondary text-textSecondary'}
                                `}
                            >
                                {post.likeCount}
                            </p>
                        </div>
                    </button>

                    {/* Comment */}
                    <button
                        onClick={() => commentExpandOnclickHandler()}
                        data-post-action="toggle-comment-section"
                        className="
                            flex gap-2 p-2 rounded-lg
                            hover:bg-bgHoverPrimary
                            transition
                        "
                    >
                        <MessageCircle
                            size={24}
                            className="text-appPrimary"
                            style={{ pointerEvents: 'none' }}
                        />
                        <div className="flex gap-2 items-center">
                            <p className="text-textSecondary">
                                Comments
                            </p>

                            <p className="text-textSecondary bg-bgSecondary px-4 rounded-2xl">
                                {post.commentCount}
                            </p>
                        </div>
                    </button>
                </div>

                <PostCommentSection postId={post.id} />
            </div>
        </div>
    )
});

Post.displayName = 'Post';
export default Post