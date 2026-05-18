import React from 'react'

const PostSkeleton = () => {
    return (
        <div className="p-5 bg-bgPrimary border border-borderPrimary flex flex-col gap-3 rounded-lg">
            
            {/* Header */}
            <div className="flex gap-3 mb-5">
                <div className="skeleton w-[45px] h-[45px] rounded-full"></div>

                <div className="flex flex-col gap-2 w-full">
                    <div className="skeleton h-[20px] w-[70%] rounded"></div>
                    <div className="skeleton h-[20px] w-[45%] rounded"></div>
                </div>
            </div>

            {/* Content lines */}
            <div className="skeleton h-[20px] w-full rounded"></div>
            <div className="skeleton h-[20px] w-[80%] rounded"></div>
            <div className="skeleton h-[20px] w-[45%] rounded mb-5"></div>

            {/* Action placeholder */}
            <div className="skeleton h-[50px] w-[30%] rounded-lg"></div>
        </div>
    )
}

export default PostSkeleton