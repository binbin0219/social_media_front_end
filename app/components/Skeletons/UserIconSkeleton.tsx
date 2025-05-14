import React from 'react'

type Props = {
    width: number | string;
    height: number | string;
}

const UserIconSkeleton = ({width, height}: Props) => {
    return (
        <div 
        className={`skeleton rounded-full`}
        style={{
            borderRadius: '50%',
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
        }}
        >

        </div>
    )
}

export default UserIconSkeleton