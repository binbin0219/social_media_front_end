"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Post, PostWithUser } from '@/lib/models/post';
import dynamic from 'next/dynamic';
import PostSkeleton from '../PostSkeleton/PostSkeleton';
import { addPosts } from '@/redux/slices/postSlice';
import { addToast } from '@/redux/slices/toastSlice';
import { createSelector } from '@reduxjs/toolkit';
import { User } from '@/lib/models/user';
import { addUsers } from '@/redux/slices/userSlice';

type Props = {
    authorId?: number,
    postLink: string
}
const DynamicPost = dynamic(() => import("@/components/Post/Post"), { 
    loading: () => <PostSkeleton/>,
    ssr: false
});

const PostList = ({authorId, postLink} : Props) => {
    const dispatch = useDispatch();
    const selectPostIds = createSelector(
        (state: any) => state.post,
        (posts: PostWithUser[]) => {
            return posts.filter(post => (authorId ? post.userId === authorId : true))
            .map(post => post.id);
        }
    );
    const postIds : number[] = useSelector(selectPostIds);
    const skeletonRef = useRef<HTMLDivElement>(null);
    const postListRef = useRef<HTMLDivElement>(null);
    const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
    const [isAllPostFetched, setIsAllPostsFetched] = useState(false);
    const [isFetchPostFailed, setIsFetchPostFailed] = useState(false);

    useEffect(() => {
        if(!skeletonRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsSkeletonVisible(entry.isIntersecting);
            },
            {root: null, threshold: 0.4}
        );

        observer.observe(skeletonRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if(isSkeletonVisible) {
            setTimeout(() => {
                fetchPostsFromServer()
                .then(posts => {
                    const postUsers : User[] = [];
                    const postUserIdsSet = new Set<number>();
                    const postsWithoutUser : Post[] = posts.map((post: PostWithUser) => {
                        const postWithoutUser : any = {
                            id: post.id,
                            title: post.title,
                            content: post.content,
                            likeCount: post.likeCount,
                            commentCount: post.commentCount,
                            comments: post.comments,
                            liked: post.liked,
                            isNew: post.isNew,
                            create_at: post.create_at
                        }

                        if(authorId) {
                            postWithoutUser.userId = authorId;
                        } else {
                            if(!post.user) throw new Error("Author id doesn't provided and server doesn't return post with user data");
                            postWithoutUser.userId = post.user.id;
                            if(post.user && !postUserIdsSet.has(post.user.id)) {
                                postUsers.push(post.user);
                                postUserIdsSet.add(post.user.id);
                            }
                        }

                        return postWithoutUser as Post;
                    })
                    .filter((post : Post) => post !== null);
                    dispatch(addPosts(postsWithoutUser));
                    dispatch(addUsers(postUsers));
                    if(posts.length < 6) setIsAllPostsFetched(true);
                })
                .catch(error => {
                    console.log(error);
                    dispatch(addToast({
                        type: 'error',
                        message: 'Failed to load posts'
                    }));
                    setIsFetchPostFailed(true);
                })
            }, 500);
        }
    }, [isSkeletonVisible]);

    const fetchPostsFromServer = async () => {
        const response = await fetch(`${postLink}?offset=${postIds.length}&recordPerPage=6`, {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) throw new Error("Failed to fetch posts");
        return response.json();
    }

    return (
        <div ref={postListRef} id="post_list" className="w-full mt-4 gap-8 flex flex-col">
            { postIds.map((postId: number) => <DynamicPost key={postId} postId={postId}/>)}

            {isFetchPostFailed ? 
                <p className='font-bold mt-3 text-center'>Failed to load posts, try refresh the page</p>  
            : 
                <>
                    {postIds.length === 0 && isAllPostFetched ?
                        <div id="no_posts_yet" className="w-full flex flex-col items-center mt-10 gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-notes-off">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
                                <path d="M11 7h4" />
                                <path d="M9 11h2" />
                                <path d="M9 15h4" />
                                <path d="M3 3l18 18" />
                            </svg>
                            <h1 className="text-2xl font-bold text-center text-gray-500">No posts yet</h1>
                        </div>
                    : null}
                    { !isAllPostFetched &&
                        <div className='flex flex-col gap-8' ref={skeletonRef}>
                            <PostSkeleton/>
                            <PostSkeleton/>
                        </div>
                    }
                    {postIds.length > 0 && isAllPostFetched ? 
                        <p className='font-bold mt-3 mb-7 text-center'>
                            No more posts
                        </p>
                    : null}
                </>
            }
            
        </div>
    )
}

export default PostList