"use client"
import { User } from '@/lib/models/user';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FriendshipStatus from '../../../../components/FriendshipStatus/FriendshipStatus';
import SectionToggles from './SectionToggles';
import styles from './style.module.css'
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
import { CalendarDays } from 'lucide-react';

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
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 pb-10 text-textPrimary">
            <div className="overflow-hidden rounded-b-2xl border border-t-0 border-borderPrimary bg-bgSecondary shadow-sm">
                <UserCover
                className='h-56 sm:h-64'
                backgroundUrl={profileUser?.background?.url}
                enableUpdate={isCurrentUserProfile}
                >
                    <div className="absolute bottom-0 left-5 sm:left-8 translate-y-1/2">
                        <UserIcon
                        userId={profileUser!.id}
                        avatarUrl={profileUser?.avatar?.url}
                        navigateToUserProfile={false}
                        width={140}
                        height={140}
                        className='border-4 border-bgSecondary shadow-xl'
                        />
                    </div>
                </UserCover>

                <div className="px-5 pb-6 pt-20 sm:px-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="min-w-0">
                            <h2 className="break-words text-3xl font-bold tracking-normal text-textPrimary sm:text-4xl">{profileUser?.username}</h2>
                            <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-textPrimary/70">
                                <div className="min-w-0 max-w-3xl">
                                    <ShowMoreText
                                    maxLength={180}
                                    className='max-w-3xl'
                                    content={profileUser?.description && profileUser?.description?.trim() !== "" ? profileUser.description : "No description yet"}
                                    />
                                </div>
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
                            {profileUser?.create_at && (
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-borderPrimary bg-bgPrimary px-3 py-1 text-xs font-medium text-textPrimary/70">
                                    <CalendarDays size={14} />
                                    Joined {new Date(profileUser.create_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {!isCurrentUserProfile && <ChatButton targetUserId={profileUser!.id}/>}
                            {!isCurrentUserProfile && <FriendshipStatus friendship={profileUser!.friendship!} userId={profileUser!.id}/>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,390px)_1fr]">
                <aside className="lg:sticky lg:top-24 h-fit">
                    <AboutCard profileUser={profileUser}/>
                </aside>

                <section id='userProfilePage' data-section={currentSection} className={`${styles.userProfilePage} space-y-4 relative min-w-0`}>
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
