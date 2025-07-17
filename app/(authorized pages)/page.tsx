import HomePageTag from '@/components/HomePageTag/HomePageTag';
import React from 'react'
import './style.css'
import PostList from '@/(authorized pages)/PostList';
import LeftSection from './LeftSection';
import RightSection from './RightSection';

const page = async () => {
    return (
        <div className='flex justify-center pt-4 gap-5'>
            <LeftSection/>
            <div className="middle">
                <HomePageTag />
                <PostList postLink={`${process.env.NEXT_PUBLIC_API_URL}/api/post/get`} />
            </div>
            <RightSection/>
        </div>
    )
}

export const dynamic = 'force-dynamic';
export default page