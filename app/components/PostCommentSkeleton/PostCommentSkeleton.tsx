import React from 'react'
import './style.css'

const PostCommentSkeleton = () => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex gap-2'>
                <div className='skeleton' style={{width: '45px', height: '45px', borderRadius: '50%'}}></div>
                <div className='flex flex-col gap-2 w-[70%]'>
                    <div className='skeleton' style={{height: '100px', borderRadius: '.5rem'}}></div>
                </div>
            </div>
            <div className='flex gap-2'>
                <div className='skeleton' style={{width: '45px', height: '45px', borderRadius: '50%'}}></div>
                <div className='flex flex-col gap-2 w-[30%]'>
                    <div className='skeleton' style={{height: '50px', borderRadius: '.5rem'}}></div>
                </div>
            </div>
            <div className='flex gap-2'>
                <div className='skeleton' style={{width: '45px', height: '45px', borderRadius: '50%'}}></div>
                <div className='flex flex-col gap-2 w-[50%]'>
                    <div className='skeleton' style={{height: '50px', borderRadius: '.5rem'}}></div>
                </div>
            </div>
        </div>
    )
}

export default PostCommentSkeleton