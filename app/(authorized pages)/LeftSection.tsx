"use client"
import UserCover from '@/components/UserCover'
import UserIcon from '@/components/UserIcon/UserIcon'
import { useDialogContext } from '@/context/DialogContext'
import { logout } from '@/lib/auth'
import { addToast } from '@/redux/slices/toastSlice'
import { RootState } from '@/redux/store'
import { IconLogout, IconSettings } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LeftSection = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const user = useSelector((state: RootState) => state.currentUser)!;
    const containerRef = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState<undefined | number>(undefined);
    const [height, setHeight] = useState<undefined | number>(undefined);
    const [shouldHide, setShouldHide] = useState(true);

    useEffect(() => {
        if(containerRef.current) {
            setTop(containerRef.current.getBoundingClientRect().top);
        }
    }, [shouldHide])

    useEffect(() => {
        const handleResize = () => {
            if (top !== undefined) {
                const newHeight = window.innerHeight - top;
                setHeight(newHeight);
            }

            setShouldHide(window.innerWidth < 1000);
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [top]);

    function logoutConf() {
        dialog.open(
            'Logout', 
            'Are you sure you want to logout?', 
            'Logout', 
            async () => {
                try {
                    await logout();
                } catch (error) {
                    console.log(error);
                    dispatch(addToast({
                        message: "Failed to logout",
                        type: "error"
                    }))
                } finally {
                    dialog.close();
                }
            }
        )
    }
    
    return (
        <div ref={containerRef} className={`w-[350px] ps-3 ${shouldHide && 'hidden'}`}>
            <div className='sticky flex flex-col gap-4 pb-3 overflow-y-auto' style={{
                top,
                height
            }}>
                <div className='flex flex-col bg-white rounded-lg card-shadow'>
                    <div className='relative w-full h-[150px]'>
                        <UserCover
                        className='h-full rounded-t-lg'
                        userId={user.id}
                        userUpdatedAt={user.updatedAt}
                        enableUpdate={true}
                        >
                        </UserCover>
                    </div>
                    <div className='relative'>
                        <UserIcon
                            userId={user?.id}
                            updatedAt={user?.updatedAt}
                            width={90}
                            height={90}
                            navigateToUserProfile
                            className='start-1/2 -translate-x-1/2 -translate-y-2/3'
                            position='absolute'
                        />
                    </div>
                    <div className='flex flex-col items-center gap-3 justify-center p-5' style={{paddingTop: '55px'}}>
                        <p className='font-bold'>{user?.username}</p>
                        <p className='text-slate-500 text-center'>{user?.description ?? "No description yet"}</p>
                        <div className='flex w-full mt-5 cursor-pointer'>
                            <div className='flex flex-col gap-2 items-center flex-1 border-e hover:bg-slate-100 py-4'>
                                <p className='font-bold'>{user?.postCount ?? 0}</p>
                                <p className='text-slate-500'>Posts</p>
                            </div>
                            <div className='flex flex-col gap-2 items-center flex-1 border-e hover:bg-slate-100 py-4'>
                                <p className='font-bold'>{user?.likeCount ?? 0}</p>
                                <p className='text-slate-500'>Likes</p>
                            </div>
                            <div className='flex flex-col gap-2 items-center flex-1 hover:bg-slate-100 py-4'>
                                <p className='font-bold'>{user?.friendCount ?? 0}</p>
                                <p className='text-slate-500'>Friends</p>
                            </div>
                        </div>
                        <button onClick={() => router.push(`/user/profile/${user?.id}`)} className='flex gap-2 bg-blue-400 hover:bg-blue-500 p-3 mt-8 rounded text-sm text-white cursor-pointer'>
                            View Profile
                        </button>
                    </div>
                </div>
                <div className='bg-white rounded-lg p-2 card-shadow'>
                    <p className='font-bold mb-2'>Quick accesses</p>
                    <div className='flex flex-col gap-2'>
                        <div onClick={() => router.push('/settings')} className='flex gap-2 items-center list-item-general'>
                            <IconSettings/>
                            Settings
                        </div>
                        <div onClick={logoutConf} className='flex gap-2 items-center list-item-general'>
                            <IconLogout/>
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftSection