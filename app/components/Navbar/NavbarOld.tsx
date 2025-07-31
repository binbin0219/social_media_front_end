"use client"
import React from 'react'
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import UserIcon from '../UserIcon/UserIcon';
import { RootState } from '@/redux/store';
import NotificationDropdown from './NotificationDropdown';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconLogout, IconSettings, IconUserScan } from '@tabler/icons-react';
import FriendListDropdown from './FriendListDropdown';
import ChatWindow from './ChatWindow/ChatWindow';
import SearchBar from './SearchBar';
import UserProfileLink from '../Link/UserProfileLink';
import { addToast } from '@/redux/slices/toastSlice';
import { logout } from '@/lib/auth';
import { useDialogContext } from '@/context/DialogContext';

export const NavbarOld = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const dialog = useDialogContext();
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const isSettingRoute = usePathname().startsWith('/settings');
    const isUserProfileRoute = usePathname().startsWith(`/user/profile/${currentUser!.id}`);

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
    <div className="bar">
        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
            <Link href={"/"} className="ms-7 text-[35px] me-[20px] text-indigo-600 cursor-pointer hover:text-indigo-500" style={{fontFamily: "fugaz one"}}>Blogify</Link>
            <div className="flex gap-3 items-center me-2">
                <SearchBar/>
                <FriendListDropdown/>
                <ChatWindow/>
                <NotificationDropdown />
                <div className="dropdown hover">
                    <UserIcon userId={currentUser!.id} updatedAt={currentUser?.updatedAt} navigateToUserProfile={false} />
                    <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-green-400 rounded-full me-[3px]"></div>
                    <div className="dropdown-menu">
                        <ul className="dropdown-content">
                            <UserProfileLink userId={currentUser!.id}>
                                <li className={`dropdown-item flex items-center gap-2 ${isUserProfileRoute ? 'active' : ''}`}>
                                    <IconUserScan/>
                                    Profile
                                </li>
                            </UserProfileLink>
                            <li
                            onClick={() => router.push('/settings')}
                            className={`dropdown-item flex items-center gap-2 ${isSettingRoute ? 'active' : ''}`}
                            >
                                <IconSettings/>
                                Settings
                            </li>
                            <li onClick={() => logoutConf()} className="dropdown-item flex items-center gap-2 text-red-500">
                                <IconLogout/>
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
