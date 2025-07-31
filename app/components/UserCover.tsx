import EditCoverInput from '@/(authorized pages)/user/profile/[userId]/EditCoverInput';
import { defaultCoverUrl } from '@/lib/constants';
import { getUserCoverLink } from '@/lib/services/user';
import React, { useEffect, useState } from 'react'
import SmartImage from './SmartImage';

type Props = {
    userId: number;
    enableUpdate?: boolean;
    userUpdatedAt?: string;
    children?: React.ReactNode;
    className?: string;
}

const UserCover = ({ enableUpdate, userId, userUpdatedAt, children, className }: Props) => {
    const [coverUrl, setCoverUrl] = useState(getUserCoverLink(userId, userUpdatedAt));

    useEffect(() => {
        const img = new Image();
        img.src = coverUrl;
        img.onerror = () => setCoverUrl(defaultCoverUrl);
    }, [coverUrl]);

    return (
        <div className={`relative ${className}`}>
            <SmartImage
                src={coverUrl}
                fallbackSrc={defaultCoverUrl}
                width={'100%'}
                height={'100%'}
                alt="User Icon"
            />
            {children}
            {enableUpdate && (
                <div className='absolute end-0 bottom-0 mb-2 me-2'>
                    <EditCoverInput setCoverUrl={setCoverUrl}/>
                </div>
            )}
        </div>
    )
}

export default UserCover