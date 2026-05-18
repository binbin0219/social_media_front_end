"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '@/lib/models/post';
import dynamic from 'next/dynamic';
import PostSkeleton from '../components/PostSkeleton/PostSkeleton';
import { addPosts, setPosts } from '@/redux/slices/postSlice';
import { addToast } from '@/redux/slices/toastSlice';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

type Props = {
    postLink: string
}
const DynamicPost = dynamic(() => import("@/components/Post/Post"), { 
    loading: () => <PostSkeleton/>,
    ssr: false
});

const PostList = ({postLink} : Props) => {
    const dispatch = useDispatch();
    const selectPostIds = createSelector(
        (state: RootState) => state.post,
        (posts: Post[]) => posts.map(post => post.id)
    );
    const postIds : number[] = useSelector(selectPostIds);
    const skeletonRef = useRef<HTMLDivElement>(null);
    const postListRef = useRef<HTMLDivElement>(null);
    const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
    const [isAllPostFetched, setIsAllPostsFetched] = useState(false);
    const [isFetchPostFailed, setIsFetchPostFailed] = useState(false);

    useEffect(() => {
        dispatch(setPosts([]));
    }, [dispatch])

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

    const fetchPostsFromServer = useCallback(async () => {
        const response = await fetch(`${postLink}?offset=${postIds.length}&recordPerPage=6`, {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) throw new Error("Failed to fetch posts");
        return response.json();
    }, [postLink, postIds.length]);

    useEffect(() => {
        if(isSkeletonVisible) {
            setTimeout(() => {
                fetchPostsFromServer()
                .then(posts => {
                    dispatch(addPosts(posts));
                    if(posts.length < 6) setIsAllPostsFetched(true);
                })
                .catch(error => {
                    console.log(error);
                    dispatch(addToast({
                        type: 'error',
                        message: 'Failed to load posts' + error
                    }));
                    setIsFetchPostFailed(true);
                })
            }, 500);
        }
    }, [isSkeletonVisible, dispatch, fetchPostsFromServer]);

    return (
        <div
            ref={postListRef}
            id="post_list"
            className="w-full mt-4 gap-8 flex flex-col"
        >
            {postIds.map((postId: number) => (
                <DynamicPost key={postId} postId={postId} />
            ))}

            {isFetchPostFailed ? (
                <p className="font-bold mt-3 text-center text-textSecondary">
                    Failed to load posts, try refreshing the page
                </p>
            ) : (
                <>
                    {/* Empty state */}
                    {postIds.length === 0 && isAllPostFetched && (
                        <div
                            id="no_posts_yet"
                            className="w-full flex flex-col items-center mt-10 gap-4 text-textSecondary"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="80"
                                height="80"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="text-textSecondary"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24h24" fill="none" />
                                <path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
                                <path d="M11 7h4" />
                                <path d="M9 11h2" />
                                <path d="M9 15h4" />
                                <path d="M3 3l18 18" />
                            </svg>

                            <h1 className="text-2xl font-bold text-center text-textSecondary">
                                No posts yet
                            </h1>
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {!isAllPostFetched && (
                        <div className="flex flex-col gap-8" ref={skeletonRef}>
                            <PostSkeleton />
                            <PostSkeleton />
                        </div>
                    )}

                    {/* End state */}
                    {postIds.length > 0 && isAllPostFetched && (
                        <p className="font-bold mt-3 mb-7 text-center text-textSecondary">
                            No more posts
                        </p>
                    )}
                </>
            )}
        </div>
    )
}

export default PostList