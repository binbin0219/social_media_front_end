"use client"
import React, { memo, useState } from 'react'
import type { CreateEditPost, Post } from '@/lib/models/post'
import { useDispatch, useSelector } from 'react-redux'
import './style.module.css';
import { addToast } from '@/redux/slices/toastSlice'
import PostCommentSection from '../PostCommentSection/PostCommentSection'
import { User } from '@/lib/models/user'
import { RootState } from '@/redux/store'
import { deletePost, updatePost } from '@/redux/slices/postSlice'
import { useDialogContext } from '@/context/DialogContext'
import PostAttachments from '../PostAttachments/PostAttachments'
import { IconDotsVertical, IconPencil, IconTrash } from '@tabler/icons-react'
import Dropdown from '../Dropdown/Dropdown'
import PostContent from './PostContent'
import CreatePostForm from '../CreatePostForm/CreatePostForm'
import { decrementLikeCount as decrementCurrentUserLikeCount, decrementPostCount } from "@/redux/slices/currentUserSlice";
import { DropdownItem } from '../NewDropdown/DropdownItem/DropdownItem'
import { apiAgent } from '@/lib/api-agent'
import PostHeader from './PostHeader'
import PostActionsSection from './PostActionsSection';
import { Eye, EyeOff } from 'lucide-react';
import { PostComment } from '@/lib/models/comment';
import { mergeByKey } from '@/utils/helpers';

type Props = {
    post: Post;
    handleEditPost: (newPost: Post) => void;
}

const Post = memo(({ post, handleEditPost }: Props) => {
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const currentUser : User = useSelector((state: RootState) => state.currentUser);
    const attachments = post.attachments.map(attachment => ({
        src: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/post/${post.id}/attachments/${attachment.id}/data.${attachment.format}`,
        mimeType: attachment.mimeType
    }))
    const isCurrentUserAuthor = currentUser?.id === post?.user?.id;
    const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState(false);
    const [commentExpanded, setCommentExpanded] = useState(false);
    const [sensitiveRevealed, setSensitiveRevealed] = useState(false);

    const showSensitiveOverlay = post.isSensitive && !sensitiveRevealed;

    if(!post) {
        return null;
    }

    const handleOpenCreatePostDialog = async () => {
        try {
            const response = await apiAgent.fetchOnClient(`/api/post/${post.id}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch post details");
            }

            const data = await response.json();

            dialog.open(
                'Edit post',
                <CreatePostForm
                    onCancel={dialog.close}
                    onSubmit={handleSubmit}
                    enableAttachment={false}
                    initialData={{
                        title: data.title,
                        content: data.content,
                        attachments: data.attachments,
                        privacySetting: data.privacySetting,
                        commentStatus: data.commentStatus,
                        isSensitive: data.isSensitive,
                        visibilityList: data.visibilityFriendList,
                    }}
                />,
            );

        } catch (error) {
            console.error("Error loading post details:", error);
        }
    };  

    const handleSubmit = async (payload: CreateEditPost) => {
        try {
            const { updatedPost } = await updatePostToServer(payload);
            handleEditPost(updatedPost);
            dispatch(updatePost({
                postId: post.id,
                content: payload.content,
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

    const updatePostToServer = async ({
        content,
        attachments,
        privacySetting,
        commentStatus,
        isSensitive,
        selectedFriends,
    }: CreateEditPost) => {

        const formData = new FormData();

        formData.set('content', content);
        formData.set('privacySetting', privacySetting);
        formData.set('commentStatus', commentStatus);
        formData.set('isSensitive', isSensitive ? 'true' : 'false');

        selectedFriends.forEach((friend) => {
            formData.append('selectedFriendIds[]', friend.id.toString());
        });

        attachments.forEach((attachment) => {
            formData.append('attachments[]', attachment.file);
        });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/post/update/${post.id}`,
            {
                method: 'POST',
                credentials: 'include',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update post');
        }

        return await response.json();
    };

    const deletePostFromServer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/delete?postId=${post.id}`, {
            method: "DELETE",
            credentials: "include"
        });
        if(!response.ok) throw new Error('Failed to delete comment');
        return await response.json();
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
                    dispatch(deletePost(post.id));
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

    const handleAddComments = async (newComments: PostComment[]) => {
        handleEditPost({
            ...post,
            comments: mergeByKey(post.comments, newComments, 'id'),
        })
    }

    const handleSentComment = async (newComment: PostComment) => {
        handleEditPost({
            ...post,
            commentCount: post.commentCount + 1,
            comments: [newComment, ...post.comments],
        })
    }

    const handleLikeCountUpdate = (newLikeCount: number) => {
        handleEditPost({
            ...post,
            likeCount: newLikeCount,
        });
    }

   return (
        <div
            className={`
                post relative w-full rounded-2xl p-4
                flex flex-col gap-3
                bg-bgSecondary
                border border-borderPrimary
                text-textPrimary
                ${post.isNew ? 'post-new' : ''}
            `}
        >
            {/* Options */}
            {isCurrentUserAuthor && (
                <div className="absolute end-3 top-3" style={{ zIndex: 10 }}>
                    <Dropdown
                        toggleButton={
                            <button className="
                                w-8 h-8 flex items-center justify-center
                                rounded-lg text-textSecondary
                                hover:bg-bgHoverSecondary hover:text-textPrimary
                                transition-colors duration-150
                            ">
                                <IconDotsVertical size={18} />
                            </button>
                        }
                        setIsOpen={(isOpen: boolean) => setIsOptionsDropdownOpen(isOpen)}
                        isOpen={isOptionsDropdownOpen}
                    >
                        <DropdownItem
                            onClick={handleOpenCreatePostDialog}
                            className="flex gap-2 items-center text-textPrimary hover:bg-bgHoverPrimary"
                        >
                            <IconPencil size={16} />
                            Edit
                        </DropdownItem>

                        <DropdownItem
                            onClick={deleteBtnHandler}
                            className="flex gap-2 items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <IconTrash size={16} />
                            Delete
                        </DropdownItem>
                    </Dropdown>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-0.5">
                <PostHeader post={post} />

                {/* Sensitive overlay */}
                {showSensitiveOverlay ? (
                    <div className="
                        mt-2.5 flex flex-col items-center justify-center gap-3
                        rounded-xl border border-amber-200 dark:border-amber-500/20
                        bg-amber-50 dark:bg-amber-500/10
                        py-8 px-4 text-center
                    ">
                        <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                            <EyeOff size={20} className="text-amber-500" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                Sensitive content
                            </p>
                            <p className="text-xs text-amber-600/70 dark:text-amber-400/60 max-w-[240px]">
                                This post has been marked as sensitive by the author.
                            </p>
                        </div>
                        <button
                            onClick={() => setSensitiveRevealed(true)}
                            className="
                                mt-1 flex items-center gap-1.5
                                text-xs font-medium px-3 py-1.5 rounded-lg
                                bg-amber-100 hover:bg-amber-200
                                dark:bg-amber-500/20 dark:hover:bg-amber-500/30
                                text-amber-700 dark:text-amber-400
                                transition-colors duration-150
                            "
                        >
                            <Eye size={13} />
                            Show anyway
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Sensitive badge — shown after reveal */}
                        {post.isSensitive && (
                            <div className="mt-2.5 flex items-center gap-1.5">
                                <span className="
                                    inline-flex items-center gap-1 text-[11px] font-medium
                                    px-2 py-0.5 rounded-full
                                    bg-amber-50 dark:bg-amber-500/10
                                    text-amber-600 dark:text-amber-400
                                    border border-amber-200 dark:border-amber-500/20
                                ">
                                    <EyeOff size={10} />
                                    Sensitive
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="post-title text-base font-medium mt-2.5 break-words text-textPrimary leading-snug">
                            {post.title}
                        </h1>

                        {/* Content */}
                        <PostContent content={post.content} />

                        {/* Attachments */}
                        {attachments.length > 0 && (
                            <div className="mt-2">
                                <PostAttachments attachments={attachments} />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-borderPrimary" />

            {/* Actions */}
            <div>
                <PostActionsSection
                    post={post}
                    commentExpanded={commentExpanded}
                    handleToggleCommentExpand={commentExpandOnclickHandler}
                    handleLikeCountUpdate={handleLikeCountUpdate}
                />

                {commentExpanded && (
                    <div className="mt-3 pt-3 border-t border-borderPrimary">
                        <PostCommentSection
                            post={post}
                            commentStatus={post.commentStatus}
                            canComment={post.canComment}
                            handleAddComments={handleAddComments}
                            handleSentComment={handleSentComment}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

Post.displayName = 'Post';
export default Post