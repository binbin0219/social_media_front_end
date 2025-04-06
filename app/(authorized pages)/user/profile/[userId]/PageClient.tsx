"use client"
import { User } from '@/lib/models/user';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FriendshipStatus from './FriendshipStatus';
import EditCoverInput from './EditCoverInput';
import dynamic from 'next/dynamic';
import ImageSkeleton from '@/components/ImageSkeleton/ImageSkeleton';
import SectionToggles from './SectionToggles';
import './style.css'
import MobileSectionToggles from './MobileSectionToggles';
import PostList from '@/components/PostList/PostList';
import { addUser } from '@/redux/slices/userSlice';
import { generateCurrentTime } from '@/utils/helpers';

type Props = {
    profileUser: User
}

const DynamicCoverImage = dynamic(() => import("next/image"), {
    loading: () => <ImageSkeleton />,
    ssr: false,
});

const PageClient = ({profileUser} : Props) => {
    console.log(profileUser);
    const dispatch = useDispatch();
    const defaultCoverUrl = 'https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid';
    const defaultProfileUrl = '/assets/default_avatar.png';
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const isCurrentUserProfile = profileUser?.id === currentUser?.id;
    const [coverUrl, setCoverUrl] = useState(profileUser?.coverUrl ?? defaultCoverUrl);
    const [currentSection, setCurrentSection] = useState('posts');

    useEffect(() => {
        dispatch(addUser(profileUser));
    }, [profileUser])

    return (
        <div 
        id='userProfilePage'
        data-section={currentSection}
        className="
            flex flex-col
            md:max-w-[800px] md:w-full md:mx-auto md:items-center md:justify-center
        ">
            <div className="user-background w-full rounded-b-lg relative border">
                <div className='w-full h-[400px] rounded-b-lg relative'>
                    <DynamicCoverImage 
                        id='cover_preview'
                        fill
                        priority
                        src={`${coverUrl}?t=${generateCurrentTime()}`}
                        alt='Profile'
                        className='background-image'
                        style={{objectFit: "cover"}}
                    />
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-black/[0.2] flex flex-col justify-end">
                    <div className="background-header w-full flex items-end justify-between px-2 relative border-b-2">
                        <div className="background-user flex gap-5 items-center">
                            <div className="profile-image w-[100px] h-[100px] rounded-full translate-y-[40px] overflow-hidden relative">
                                <DynamicCoverImage 
                                    fill
                                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                    priority
                                    src={profileUser?.avatar ?? defaultProfileUrl}
                                    alt='Profile'
                                    style={{objectFit: "cover"}}
                                />
                            </div>
                            <p className="user-name text-white font-bold text-2xl items-center translate-y-[25px]">{profileUser?.username} {isCurrentUserProfile ? '(You)' : ''}</p>
                        </div>
                        {profileUser?.id === currentUser?.id ? 
                            <EditCoverInput setCoverUrl={setCoverUrl} />
                        :
                            <FriendshipStatus friendship={profileUser?.friendship} profileUserId={profileUser?.id}/>
                        }
                    </div>
                </div>
            </div> 
            <SectionToggles setCurrentSection={setCurrentSection}/>
            <MobileSectionToggles setCurrentSection={setCurrentSection}/>
            <div id="profile_sections" className="w-full px-2">
                <div id="posts_section" className="w-full mt-4 gap-8 flex flex-col hidden">
                    <PostList authorId={profileUser?.id} postLink={`${process.env.NEXT_PUBLIC_API_URL}/api/post/get/${profileUser?.id}`} />
                </div>
                <div id="about_section" className="w-full mt-4 gap-8 flex flex-col hidden">
                    <div className="w-full flex flex-col rounded-lg border items-center bg-white">
                        <h1 className="p-4 font-bold text-2xl border-b w-full">About</h1>
                        <div className="border-b flex gap-3 w-[95%] p-4">
                            <div className="flex gap-3 w-[50%]">
                                <div className="w-[45px] h-[45px] border rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-signature">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 17c3.333 -3.333 5 -6 5 -8c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 4.877 2.5 6c1.5 2 2.5 2.5 3.5 1l2 -3c.333 2.667 1.333 4 3 4c.53 0 2.639 -2 3 -2c.517 0 1.517 .667 3 2" />
                                    </svg>
                                </div> 
                                <div className="flex flex-col">
                                    <h4 className="font-bold">Name</h4>
                                    <h6 className="text-sm">{profileUser?.firstName} {profileUser?.lastName}</h6>
                                </div>
                            </div>
                            <div className="flex gap-3 w-[50%]">
                                <div className="w-[45px] h-[45px] border rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-gender-male">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M10 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                                        <path d="M19 5l-5.4 5.4" />
                                        <path d="M19 5h-5" />
                                        <path d="M19 5v5" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold">Gender</h4>
                                    <h6 className="text-sm">{profileUser?.gender}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="border-b flex gap-3 w-[95%] p-4">
                            <div className="flex gap-3 w-[50%]">
                                <div className="w-[45px] h-[45px] border rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold">Location</h4>
                                    {profileUser?.country === null ? 
                                        <h6 className="text-sm">Unkown</h6>
                                    :
                                        <h6 className="text-sm">From {profileUser?.country} {profileUser?.region ?? ""}</h6>
                                    }
                                </div>
                            </div>
                            <div className="flex gap-3 w-[50%]">
                                <div className="w-[45px] h-[45px] border rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold">Relationship</h4>
                                    <h6 className="text-sm">{profileUser?.relationshipStatus ?? "Unkown"}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="border-b flex gap-3 w-[95%] p-4">
                            <div className="flex gap-3 w-[50%]">
                                <div className="w-[45px] h-[45px] border rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                                        <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                                        <path d="M12 12l0 .01" />
                                        <path d="M3 13a20 20 0 0 0 18 0" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold">Occupation</h4>
                                    <h6 className="text-sm">{profileUser?.occupation ?? "Unkown"}</h6>
                                </div>
                            </div>
                            <div className="flex gap-3 w-[50%]">
                                <div className="w-[45px] h-[45px] border rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-mobile">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14z" />
                                        <path d="M11 4h2" />
                                        <path d="M12 17v.01" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold">Phone Number</h4>
                                    {profileUser?.phoneNumber === null ? 
                                        <h6 className="text-sm">Unkown</h6>
                                    :
                                        <h6 className="text-sm">+{profileUser?.phoneNumber.dialCode} {profileUser?.phoneNumber.phoneNumberBody}</h6>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="friends_section" className="w-full mt-4 flex flex-col hidden relative border rounded-lg bg-white">
                    <h5 className="font-bold text-2xl p-3 border-b">Friends</h5>
                </div>
                <div id="photos_section" className="w-full mt-4 gap-8 flex flex-col hidden">
            
                </div>
            </div>
        </div>
    )
}

export default PageClient