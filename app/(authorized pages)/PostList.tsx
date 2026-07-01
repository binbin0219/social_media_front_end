"use client"
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Post } from '@/lib/models/post';
import dynamic from 'next/dynamic';
import PostSkeleton from '../components/PostSkeleton/PostSkeleton';
import { addToast } from '@/redux/slices/toastSlice';
import DataLoader from '@/components/DataLoader/DataLoader';
import HomePageTag from '@/components/HomePageTag/HomePageTag';
import PostDialog from '@/components/PostDialog';

type Props = {
    postLink?: string;
    fetchPosts?: (start: number, length: number) => Promise<Post[]>;
    showHomePageTag?: boolean;
    containerId?: string;
    className?: string;
    emptyState?: React.ReactNode;
}

const DynamicPost = dynamic(() => import("@/components/Post/Post"), {
    loading: () => <PostSkeleton />,
    ssr: false
});

const PostList = ({
    postLink,
    fetchPosts: fetchPostsProp,
    showHomePageTag = true,
    containerId = 'post_list',
    className = 'w-full mt-4 gap-8 flex flex-col',
    emptyState,
}: Props) => {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState<Post[]>([]);
    const postListRef = useRef<HTMLDivElement>(null);
    const [isAllPostFetched, setIsAllPostsFetched] = useState(false);
    const [isFetchPostFailed, setIsFetchPostFailed] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const fetchPosts = useCallback(async () => {
        if (fetchPostsProp) {
            return fetchPostsProp(posts.length, 6);
        }

        if (!postLink) {
            throw new Error("PostList requires either postLink or fetchPosts");
        }

        const response = await fetch(`${postLink}?start=${posts.length}&length=6`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Failed to fetch posts");
        const { data } = await response.json();
        return data;
    }, [fetchPostsProp, postLink, posts.length]);

    const handleDataLoaderVisible = async () => {
        setTimeout(() => {
            fetchPosts()
                .then(newPosts => {
                    setPosts(prev => {
                        const existingPostIds = new Set(prev.map(post => post.id));
                        const uniqueNewPosts = newPosts.filter((post: Post) => !existingPostIds.has(post.id));
                        return [...prev, ...uniqueNewPosts];
                    });
                    if (newPosts.length < 6) setIsAllPostsFetched(true);
                })
                .catch(error => {
                    console.log(error);
                    dispatch(addToast({ type: 'error', message: 'Failed to load posts' + error }));
                    setIsFetchPostFailed(true);
                });
        }, 500);
    };

    const handleEditPost = (newPost: Post) => {
        setPosts(prev => prev.map(p => p.id === newPost.id ? newPost : p));
        // Keep the dialog in sync if it's open for this post
        if (selectedPost?.id === newPost.id) setSelectedPost(newPost);
    };

    const handleAddPost = (post: Post) => {
        setPosts(prev => [post, ...prev]);
    };

    const handleDeletePost = (postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setSelectedPost(null);
    };

    return (
        <>
            {showHomePageTag && <HomePageTag handleAddPost={handleAddPost} />}
            <div
                ref={postListRef}
                id={containerId}
                className={className}
            >
                {posts.map((post: Post) => (
                    <DynamicPost
                        key={post.id}
                        post={post}
                        handleExpandCommentSection={setSelectedPost}
                        handleAddPost={handleAddPost}
                        handleEditPost={handleEditPost}
                        handleDeletePost={handleDeletePost}
                        onPostClick={setSelectedPost}
                    />
                ))}

                {isFetchPostFailed ? (
                    <p className="font-bold mt-3 text-center text-textSecondary">
                        Failed to load posts, try refreshing the page
                    </p>
                ) : (
                    <>
                        {posts.length === 0 && isAllPostFetched && (
                            emptyState ?? (
                                <div id="no_posts_yet" className="w-full flex flex-col items-center mt-10 gap-4 text-textSecondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-textSecondary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24h24" fill="none" />
                                        <path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
                                        <path d="M11 7h4" />
                                        <path d="M9 11h2" />
                                        <path d="M9 15h4" />
                                        <path d="M3 3l18 18" />
                                    </svg>
                                    <h1 className="text-2xl font-bold text-center text-textSecondary">No posts yet</h1>
                                </div>
                            )
                        )}

                        {!isAllPostFetched && (
                            <DataLoader onVisible={handleDataLoaderVisible}>
                                <div className="flex flex-col gap-8">
                                    <PostSkeleton />
                                    <PostSkeleton />
                                </div>
                            </DataLoader>
                        )}

                        {posts.length > 0 && isAllPostFetched && (
                            <p className="font-bold mt-3 mb-7 text-center text-textSecondary">
                                No more posts
                            </p>
                        )}
                    </>
                )}
            </div>

            {selectedPost && (
                <PostDialog
                    post={selectedPost}
                    isOpen={!!selectedPost}
                    showCloseBtn={false}
                    onClose={() => setSelectedPost(null)}
                    handleAddPost={handleAddPost}
                    handleEditPost={handleEditPost}
                    handleDeletePost={handleDeletePost}
                />
            )}
        </>
    );
};

export default PostList;
