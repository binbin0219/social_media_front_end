"use client"
import { User } from '@/lib/models/user';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FriendshipStatus from './FriendshipStatus';
import SectionToggles from './SectionToggles';
import './style.css'
import { addUser } from '@/redux/slices/userSlice';
import ChatButton from '@/components/ChatButton';
import PostSection from './sections/PostSection';
import { setPosts } from '@/redux/slices/postSlice';
import FriendsSection from './sections/FriendsSection';
import UserDescriptionEditBtn from '@/components/Buttons/UserDescriptionEditBtn';
import { updateProfile } from '@/redux/slices/currentUserSlice';
import ShowMoreText from '@/components/ShowMoreText';
import AboutCard from './AboutCards/AboutCard';
import UserCover from '@/components/UserCover';
import UserIcon from '@/components/UserIcon/UserIcon';

type Props = {
    profileUser: User
}

const PageClient = ({profileUser} : Props) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const isCurrentUserProfile = profileUser?.id === currentUser?.id;
    if(isCurrentUserProfile) profileUser = currentUser;
    const [currentSection, setCurrentSection] = useState('posts');

    // Clear redux's posts state (clear post fetched from previous page)
    useEffect(() => {
        dispatch(setPosts([]));
    }, [dispatch])

    useEffect(() => {
        dispatch(addUser(profileUser));
    }, [profileUser, dispatch])

    return (
        <div className="w-full max-w-7xl mx-auto">
            <UserCover
            className='h-60'
            userId={profileUser!.id}
            userUpdatedAt={profileUser?.updatedAt}
            enableUpdate={isCurrentUserProfile}
            >
                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                    <UserIcon
                    userId={profileUser!.id}
                    updatedAt={profileUser?.updatedAt}
                    navigateToUserProfile={false}
                    width={135}
                    height={135}
                    className='border-4 border-white'
                    />
                </div>
            </UserCover>

            {/* Profile Info */}
            <div className="pt-20 px-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white pb-4 rounded-b-lg">
                <div>
                    <h2 className="text-2xl font-bold">{profileUser?.username}</h2>
                    <div className='flex gap-2'>
                        <ShowMoreText
                        maxLength={150}
                        className='mt-2 max-w-2xl'
                        content={profileUser?.description && profileUser?.description?.trim() !== "" ? profileUser.description : "No description yet"}
                        />
                        {isCurrentUserProfile && (
                            <UserDescriptionEditBtn 
                            description={profileUser!.description ?? ""}
                            onDone={(newDes) => {
                                dispatch(updateProfile({
                                    description: newDes
                                }));
                            }}
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    {!isCurrentUserProfile && <ChatButton targetUserId={profileUser!.id}/>}
                    {!isCurrentUserProfile && <FriendshipStatus friendship={profileUser!.friendship!} userId={profileUser!.id}/>}
                </div>
            </div>

            <div className="mt-8 px-4 grid grid-cols-1 lg:grid-cols-[minmax(260px,475px)_1fr] gap-6">
                <aside className="lg:sticky lg:top-24 h-fit">
                    <AboutCard profileUser={profileUser}/>
                </aside>

                <section id='userProfilePage' data-section={currentSection} className="space-y-4 relative min-w-0">
                    <SectionToggles setCurrentSection={setCurrentSection}/>
                    <PostSection profileUser={profileUser}/>
                    <FriendsSection profileUser={profileUser!}/>
                    <div id="photos_section" className="w-full mt-4 gap-8 flex flex-col hidden">
            
                    </div>
                </section>
            </div>
        </div>
        
    )
}

export default PageClient