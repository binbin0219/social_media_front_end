import React from 'react'
import styles from './style.module.css'
import PostList from '@/(authorized pages)/PostList';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import StoryList from './StoryList';

const page = async () => {
    return (
        <div className='flex justify-center pt-4 gap-5 bg-bgPrimary'>
            <LeftSection/>
            <div className={`${styles['middle']}`}>
                <StoryList/>
                <PostList postLink={`${process.env.NEXT_PUBLIC_API_URL}/api/post/get`} />
            </div>
            <RightSection/>
        </div>
    )
}

export const dynamic = 'force-dynamic';
export default page