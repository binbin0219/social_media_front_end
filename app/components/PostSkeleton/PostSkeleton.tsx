import React from 'react'

const PostSkeleton = () => {
    return (
        <div className='p-5 bg-white flex flex-col gap-3 rounded-lg'>
            <div className='flex gap-3 mb-5'>
                <div className='skeleton' style={{width: '45px', height: '45px', borderRadius: '50%'}}></div>
                <div className='flex flex-col gap-2 w-full'>
                    <div className='skeleton' style={{height: '20px', width: '70%'}}></div>
                    <div className='skeleton' style={{height: '20px', width: '45%'}}></div>
                </div>
            </div>
            <div className='skeleton' style={{height: '20px', width: '100%'}}></div>
            <div className='skeleton' style={{height: '20px', width: '80%'}}></div>
            <div className='skeleton mb-5' style={{height: '20px', width: '45%'}}></div>
            <div className='skeleton' style={{height: '50px', borderRadius: '.5rem', width: '30%'}}></div>
        </div>
    )
}

export default PostSkeleton