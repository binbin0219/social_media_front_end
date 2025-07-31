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
        <div className={`post relative w-full rounded-lg p-3 flex flex-col gap-2 rounded-xl bg-white card-shadow ${post.isNew ? 'post-new' : ''}`}
        data-comment-expanded={commentExpanded}>
            {isCurrentUserAuthor && (
                <div className='absolute end-0 top-0 mt-2 me-2' style={{zIndex: 10}}>
                    <Dropdown
                    toggleButton={
                        <button className=' text-slate-400 hover:opacity-50 transition-opacity duration-200'>
                            <IconDotsVertical/>
                        </button>
                    }
                    setIsOpen={(isOpen: boolean) => setIsOptionsDropdownOpen(isOpen)}
                    isOpen={isOptionsDropdownOpen}
                    >
                        <button onClick={handleOpenCreatePostDialog} className='dropdown-item flex gap-2 items-center'>
                            <IconPencil/>
                            Edit
                        </button>
                        <button onClick={deleteBtnHandler} className='dropdown-item flex gap-2 items-center text-red-500'>
                            <IconTrash/>
                            Delete
                        </button>
                    </Dropdown>
                </div>
            )}
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 cursor-pointer">
                    <UserIcon userId={author!.id} updatedAt={author?.updatedAt} />
                    <div className="flex flex-col">
                        <h4 onClick={() => router.push(`/user/profile/${author?.id}`)} className="font-bold hover:underline">{author?.username ?? "Unknown"} {isCurrentUserAuthor ? '(You)' : ''}</h4>
                        <DynamicTooltip className='w-fit' text={new Date(post.create_at).toLocaleString()} >
                            <h6 className="text-sm text-slate-500 hover:underline">{timeAgo(post.create_at)}</h6>
                        </DynamicTooltip>
                    </div>
                </div>
                <h1 className="post-title font-bold mt-3" style={{wordWrap: "break-word"}}>
                    {post.title}
                </h1>
                <PostContent content={post.content}/>
                {attachments.length > 0 && <PostAttachments attachments={attachments} />}
            </div>
            <div className="mt-2">
                <div className="buttons flex gap-2 mt-2 rounded-lg items-center w-fit">
                    <button
                        ref={likeBtnRef}
                        onClick={() => likeOnclickHandler()}
                        style={{color: "black"}}
                        className={`flex gap-2 p-2 rounded-lg hover-soft ${likeState.liked ? 'hover:bg-red-200' : 'hover:bg-slate-200'}`}>
                        {likeState.liked &&
                            <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#F9452C" stroke="#F9452C" className="icon icon-tabler icons-tabler-filled icon-tabler-heart icon-liked">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                            </svg>
                        }
                        {!likeState.liked &&
                            <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F9452C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart icon-like">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                            </svg>
                        }
                        <div className='flex gap-2 items-center'>
                            <p className={`${likeState.liked ? 'text-red-500' : 'text-slate-500'}`}>
                                {likeState.liked ? 'Liked' : 'Like'}
                            </p>
                            <p className={`px-4 rounded-2xl ${likeState.liked ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                                {post.likeCount}
                            </p>
                        </div>
                    </button>
                    <button 
                        onClick={() => commentExpandOnclickHandler()}
                        data-post-action="toggle-comment-section"
                        className="flex gap-2 hover:bg-slate-200 p-2 rounded-lg hover-soft"
                        >
                        <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#2293F9" stroke="#2293F9" className="icon icon-tabler icons-tabler-filled icon-tabler-message icon-comment-opened">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 3a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-4.724l-4.762 2.857a1 1 0 0 1 -1.508 -.743l-.006 -.114v-2h-1a4 4 0 0 1 -3.995 -3.8l-.005 -.2v-8a4 4 0 0 1 4 -4zm-4 9h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m2 -4h-8a1 1 0 1 0 0 2h8a1 1 0 0 0 0 -2" />
                        </svg>
                        <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2293F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message icon-comment-closed">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 9h8" />
                            <path d="M8 13h6" />
                            <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                        </svg>
                        <div className='flex gap-2 items-center'>
                            <p className='text-slate-500'>
                                Comments
                            </p>
                            <p className='text-slate-500 bg-slate-100 px-4 rounded-2xl'>
                                {post.commentCount}
                            </p>
                        </div>
                    </button>
                </div>
                <PostCommentSection postId={post.id}/>
            </div>
        </div>
    )
});

Post.displayName = 'Post';
export default Post