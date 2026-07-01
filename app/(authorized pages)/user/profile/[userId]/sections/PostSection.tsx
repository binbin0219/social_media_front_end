import DataLoader from '@/components/DataLoader/DataLoader'
import Post from '@/components/Post/Post';
import PostSkeleton from '@/components/PostSkeleton/PostSkeleton'
import { Post as PostType } from '@/lib/models/post';
import { User } from '@/lib/models/user';
import { postService } from '@/lib/services/post';
import React, { useState } from 'react'

type Props = {
    profileUser: User;
}

const PostSection = ({profileUser}: Props) => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isAllPostFetched, setIsAllPostFetched] = useState(false);
    
    const handleDataLoaderVisible = async () => {
        try {
            const fetchedPostsWithUserId = await postService.fetchPostsByUserId(profileUser!.id!, posts.length, 6);
            const fetchedPosts: PostType[] = fetchedPostsWithUserId.map(post => ({
                ...post,
                user: profileUser,
            }));

            setPosts(prev => {
                const existingPostIds = new Set(prev.map(post => post.id));
                const newPosts = fetchedPosts.filter(post => !existingPostIds.has(post.id));
                return [...prev, ...newPosts];
            });

            if (fetchedPosts.length < 6) {
                setIsAllPostFetched(true);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleAddPost = (post: PostType) => {
        setPosts(prev => [post, ...prev]);
    };

    const handleEditPost = (newPost: PostType) => {
        setPosts(prev => prev.map(post => post.id === newPost.id ? newPost : post));
    };

    const handleDeletePost = (postId: number) => {
        setPosts(prev => prev.filter(post => post.id !== postId));
    };

    return (
        <div id="posts_section" className="w-full mt-4 gap-8 flex flex-col pb-5 hidden">
            {posts.length === 0 && isAllPostFetched ?
                <div id="no_posts_yet" className="w-full flex flex-col items-center mt-10 gap-4 text-textPrimary/60">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-notes-off">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
                        <path d="M11 7h4" />
                        <path d="M9 11h2" />
                        <path d="M9 15h4" />
                        <path d="M3 3l18 18" />
                    </svg>
                    <h1 className="text-2xl font-bold text-center">No posts yet</h1>
                </div>
            : null}
            {posts.map(post => (
                <Post
                    key={post.id}
                    post={post}
                    handleAddPost={handleAddPost}
                    handleEditPost={handleEditPost}
                    handleDeletePost={handleDeletePost}
                />
            ))}
            {!isAllPostFetched && (
                <DataLoader className='flex gap-8 flex-col' onVisible={handleDataLoaderVisible}>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </DataLoader>
            )}
        </div>
    )
}

export default PostSection
