import PostList from '../../../../PostList';
import { Post as PostType } from '@/lib/models/post';
import { User } from '@/lib/models/user';
import { postService } from '@/lib/services/post';
import { FileText } from 'lucide-react';
import React, { useCallback } from 'react'

type Props = {
    profileUser: User;
}

const PostSection = ({ profileUser }: Props) => {
    const fetchProfilePosts = useCallback(async (start: number, length: number): Promise<PostType[]> => {
        const fetchedPosts = await postService.fetchPostsByUserId(profileUser.id, start, length);
        return fetchedPosts.map(post => ({
            ...post,
            user: profileUser,
        }));
    }, [profileUser]);

    return (
        <PostList
            fetchPosts={fetchProfilePosts}
            showHomePageTag={false}
            containerId="posts_section"
            className="w-full mt-4 gap-8 flex flex-col pb-5 hidden"
            emptyState={
                <div id="no_posts_yet" className="w-full flex flex-col items-center rounded-2xl border border-dashed border-borderPrimary bg-bgSecondary px-6 py-12 text-center shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bgHoverPrimary text-appPrimary">
                        <FileText size={30} />
                    </div>
                    <h1 className="mt-5 text-2xl font-bold text-textPrimary">No posts yet</h1>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-textPrimary/60">
                        Posts shared by {profileUser.username} will appear here.
                    </p>
                </div>
            }
        />
    )
}

export default PostSection
