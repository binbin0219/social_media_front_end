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
import { useSubcribeLikeWebSocket } from '@/hooks/useSubcribeLikeWebSocket'

type Props = {
    postId: number,
}

const Post = memo(({ postId: postId }: Props) => {
    useSubcribeLikeWebSocket(postId);
    const router = useRouter();
    const dispatch = useDispatch();
    const likeBtnRef = useRef<HTMLButtonElement>(null);
    const currentUser : User = useSelector((state: RootState) => state.currentUser);
    const post : Post = useSelector((state: any) => state.post.find((post: Post) => post.id === postId));
    const isCurrentUserAuthor = currentUser?.id === post.user?.id;
    const author = post.user;
    const [commentExpanded, setCommentExpanded] = useState(false);
    const [likeState, setLikeState] = useState({
        liked: post.liked,
    })

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                postId: post.id,
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
        (element.current as HTMLButtonElement).classList.add('pointer-events-none');
        setTimeout(() => {
            (element.current as HTMLButtonElement).classList.remove('pointer-events-none');
        }, 1000);
    }

    const likeOnclickHandler = async (event : React.MouseEvent) => {
        try {
            disableBtnFor1s(likeBtnRef);
            await sendLikeToServer();
            setLikeState(prevState => ({
                liked: !prevState.liked
            }));
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                type: 'error',
                message: "Failed to like post!"
            }));
        }
    }

    const commentExpandOnclickHandler = () => {
        setCommentExpanded(!commentExpanded);
    }

    const editBtnHandler = () => {
        confDialog(
            'Edit Post',
            `   
                <div class="flex flex-col w-[600px] max-w-[85vw]">
                    <p class="mb-1 text-sm">Header</p>
                    <input id="postEditTitle" value="${post.title}" type="text" class="w-full border rounded mb-3 p-2 text-sm focus:border-slate-400 outline-none"/>
                    <p class="mb-1 text-sm">Body</p>
                    <textarea id="postEditContent" rows="7" type="text" class="w-full border rounded p-2 text-sm focus:border-slate-400 outline-none">${post.content}</textarea>
                </div>
            `,
            'Done',
            async () => {
                try {
                    const postEditTitle = document.getElementById('postEditTitle') as HTMLInputElement;
                    const postEditContent = document.getElementById('postEditContent') as HTMLTextAreaElement;
                    const newTitle = postEditTitle.value;
                    const newContent = postEditContent.value;
                    if(newTitle.trim() === '') postEditTitle.classList.add('border-red-500');
                    if(newContent.trim() === '') postEditContent.classList.add('border-red-500');
                    if(newTitle.trim() === '' || newContent.trim() === '') return;
                    await updatePostToServer(newTitle, newContent);
                    dispatch(updatePost({
                        postId: postId,
                        content: newContent,
                        title: newTitle
                    }))
                    dispatch(addToast({
                        type: 'success',
                        message: 'Post updated'
                    }));
                    confDialog();
                } catch (error) {
                    console.log(error);
                    dispatch(addToast({
                        type: 'error',
                        message: 'Failed to update post'
                    }));
                    confDialog();
                }
            }
        )
    }

    const deleteBtnHandler = () => {
        confDialog(
            'Delete Post',
            `Are you sure to delete this post?`,
            'Delete',
            async () => {
                try {
                    await deletePostFromServer();
                    dispatch(deletePost(postId));
                    dispatch(addToast({
                        type: 'success',
                        message: 'Post deleted successfully'
                    }));
                    confDialog();
                } catch (error) {
                    console.log(error);
                    dispatch(addToast({
                        type: 'error',
                        message: 'Failed to delete post'
                    }));
                    confDialog();
                }
            }
        )
    }

    return (
        <div className={`post w-full rounded-lg p-3 flex flex-col gap-2 border rounded-lg bg-white ${post.isNew ? 'post-new' : ''}`}
        data-liked={likeState.liked}
        data-comment-expanded={commentExpanded}>
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 cursor-pointer">
                    <UserIcon userId={author?.id} userAvatar={author?.avatar} />
                    <div className="flex flex-col">
                        <h4 onClick={() => router.push(`/user/profile/${author?.id}`)} className="font-bold hover:underline">{author?.username ?? "Unknown"} {isCurrentUserAuthor ? '(You)' : ''}</h4>
                        <h6 className="text-sm hover:underline">{new Date(post.create_at).toLocaleString()} ({timeAgo(post.create_at)})</h6>
                    </div>
                </div>
                <h1 className="post-title font-bold mt-3" style={{wordWrap: "break-word"}}>
                    {post.title}
                </h1>
                <p className="post-content" style={{wordWrap: "break-word"}}>
                {post.content.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
                </p>
            </div>
            <div className="mt-3 border-t-2 border-gray-200">
                <div className="buttons flex gap-5 mt-2 rounded-lg p-3 items-center w-fit border-2 bg-slate-100 border-slate-300">
                    <button
                        ref={likeBtnRef}
                        onClick={(event) => likeOnclickHandler(event)}
                        style={{color: "black"}}
                        className="post-like-toggle flex gap-2 editing-disabled">
                        <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#F9452C" stroke="#F9452C" className="icon icon-tabler icons-tabler-filled icon-tabler-heart icon-liked">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                        </svg>
                        <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F9452C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart icon-like">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                        </svg>
                        <p className="like-count">{post.likeCount}</p>
                    </button>
                    <button 
                        onClick={() => commentExpandOnclickHandler()}
                        data-post-action="toggle-comment-section"
                        className="comment flex gap-2 editing-disabled text-black"
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
                        <p className="comment-count">{post.commentCount}</p>
                    </button>
                    { isCurrentUserAuthor ?
                    <>
                        <button
                            onClick={editBtnHandler}
                            data-post-action="edit-post"
                            className="edit edit-button editing-disabled">
                            <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9725FB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-edit icon-edit-post">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                <path d="M16 5l3 3" />
                            </svg>
                        </button>
                        <button onClick={deleteBtnHandler} data-post-action="delete-post" className="delete editing-disabled">
                            <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0005" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 7l16 0" />
                                <path d="M10 11l0 6" />
                                <path d="M14 11l0 6" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                        </button>
                    </>
                    : null}
                </div>
                <PostCommentSection postId={post.id}/>
            </div>
        </div>
    )
});

export default Post