import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    userId: number,
    children: React.ReactNode
}

const UserProfileLink = ({userId, children}: Props) => {
    const router = useRouter();

    return (
        <div onClick={() => router.push(`/user/profile/${userId}`)}>
            {children}
        </div>
    )
}

export default UserProfileLink