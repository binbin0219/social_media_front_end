"use client"
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Post } from '@/lib/models/post';
import dynamic from 'next/dynamic';
import PostSkeleton from '../components/PostSkeleton/PostSkeleton';
import { addToast } from '@/redux/slices/toastSlice';
import DataLoader from '@/components/DataLoader/DataLoader';

type Props = {
    postLink: string
}
const DynamicPost = dynamic(() => import("@/components/Post/Post"), { 
    loading: () => <PostSkeleton/>,
    ssr: false
});

const PostList = ({postLink} : Props) => {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState<Post[]>([]);
    const postListRef = useRef<HTMLDivElement>(null);
    const [isAllPostFetched, setIsAllPostsFetched] = useState(false);
    const [isFetchPostFailed, setIsFetchPostFailed] = useState(false);

    const fetchPosts = useCallback(async () => {
        const response = await fetch(`${postLink}?start=${posts.length}&length=6`, {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) throw new Error("Failed to fetch posts");
        const { data } = await response.json();
        return data;
    }, [postLink, posts.length]);

    const handleDataLoaderVisible = async () => {
        setTimeout(() => {
            fetchPosts()
            .then(newPosts => {
                setPosts([...posts, ...newPosts])
                if(newPosts.length < 6) setIsAllPostsFetched(true);
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

    const handleEditPost = (newPost: Post) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === newPost.id ? newPost : post
            )
        );
    };

    return (
        <div
            ref={postListRef}
            id="post_list"
            className="w-full mt-4 gap-8 flex flex-col"
        >
            {posts.map((post: Post) => (
                <DynamicPost key={post.id} post={post} handleEditPost={handleEditPost} />
            ))}

            {isFetchPostFailed ? (
                <p className="font-bold mt-3 text-center text-textSecondary">
                    Failed to load posts, try refreshing the page
                </p>
            ) : (
                <>
                    {/* Empty state */}
                    {posts.length === 0 && isAllPostFetched && (
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
                        <DataLoader onVisible={handleDataLoaderVisible}>
                            <div className="flex flex-col gap-8">
                                <PostSkeleton />
                                <PostSkeleton />
                            </div>
                        </DataLoader>
                    )}

                    {/* End state */}
                    {posts.length > 0 && isAllPostFetched && (
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