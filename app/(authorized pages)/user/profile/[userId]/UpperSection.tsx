import ImageSkeleton from '@/components/ImageSkeleton/ImageSkeleton';
import { generateCurrentTime } from '@/utils/helpers';
import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react'

type Props = {
    coverUrl: string,
    avatarUrl: string,
}

const DynamicCoverImage = dynamic(() => import("next/image"), {
    loading: () => <ImageSkeleton />,
    ssr: false,
});

const UpperSection = (props: Props) => {
    const [coverUrl, setCoverUrl] = useState(props.coverUrl);
    const coverRef = useRef<HTMLImageElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const defaultCoverUrl = 'https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid';
    const defaultProfileUrl = '/assets/default_avatar.png';

    return (
        <div className="user-background w-full rounded-b-lg relative border">
            <div className='relative w-full h-[400px] rounded-b-lg'>
                <DynamicCoverImage
                    src={coverUrl + `?t=${generateCurrentTime()}`}
                    alt='Cover'
                    className='background-image w-full h-[400px]'
                    style={{ objectFit: "cover" }}
                    ref={coverRef}
                    fill
                    priority
                    id="cover_preview"
                    onError={() => setCoverUrl(defaultCoverUrl)}
                />   
            </div>      
            <div className="absolute top-0 left-0 w-full h-full bg-black/[0.2] flex flex-col justify-end">
                <div className="background-header w-full flex items-end justify-between px-2 relative border-b-2">
                    <div className="background-user flex gap-5 items-center">
                        <div className="profile-image w-[100px] h-[100px] rounded-full translate-y-[40px] relative overflow-hidden">
                            <DynamicCoverImage
                                src={profileUser?.avatar ?? defaultProfileUrl}
                                alt='Profile'
                                className='profile-image w-full h-full'
                                style={{ objectFit: "cover" }}
                                fill
                                priority
                            />   
                        </div>
                        <p className="user-name text-white font-bold text-2xl items-center translate-y-[25px]">{profileUser?.username} {isCurrentUserProfile ? '(You)' : ''}</p>
                    </div>
                    {profileUser?.id === currentUser?.id ? 
                        <>
                            <label id="edit_cover_btn" htmlFor="edit_cover_input" className="border-black border-2 px-3 py-2 rounded-lg bg-black bg-opacity-50 text-white mb-1 cursor-pointer hover:bg-black hover:bg-opacity-100">
                                <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-camera inline">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                    <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                </svg>
                                Edit Cover
                            </label>
                            <input ref={coverInputRef} onInput={() => handleEditCover()} type="file" accept="image/png" name="edit_cover_input" id="edit_cover_input" className="hidden"></input>
                        </>
                    :
                        <FriendshipStatus/>
                    }
                </div>
            </div>
        </div> 
    )
}

export default UpperSection