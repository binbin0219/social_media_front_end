import CreatePostForm from '@/components/CreatePostForm/CreatePostForm';
import React from 'react'
import './style.css'
import PostList from '@/components/PostList/PostList';

const page = async () => {
    return (
        <div className="middle px-2 pt-4">
            <CreatePostForm />
            <PostList postLink={`${process.env.NEXT_PUBLIC_API_URL}/api/post/get`} />
        </div>
    )
}

export default page