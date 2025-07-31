"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import FriendListDropdown from './FriendListDropdown';
import NotificationDropdown from './NotificationDropdown';
import ChatWindow from './ChatWindow/ChatWindow';
import UserIcon from '../UserIcon/UserIcon';
import UserProfileLink from '../Link/UserProfileLink';
import { IconLogout, IconMenu, IconSettings, IconUserScan, IconX } from '@tabler/icons-react';
import { logout } from '@/lib/auth';
import { addToast } from '@/redux/slices/toastSlice';
import { usePathname, useRouter } from 'next/navigation';
import { useDialogContext } from '@/context/DialogContext';
import Dropdown from '../Dropdown/Dropdown';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const user = useSelector((state: RootState) => state.currentUser)!;
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link href={"/"} className="text-4xl me-12 text-indigo-600 cursor-pointer hover:text-indigo-500 transition-colors duration-300" style={{ fontFamily: "fugaz one" }}>
              Blogify
            </Link>
          </div>

          <SearchBar/>

          {/* Right Side: Icons and Profile (visible on md screens and up) */}
          <div className="flex items-center space-x-4">
            
            <FriendListDropdown/>

            <NotificationDropdown/>

            <ChatWindow/>

            <Dropdown
            toggleButton={(
              <div className='relative'>
                <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-green-400 rounded-full me-[3px] z-10"></div>
                <UserIcon
                className={`${isProfileMenuOpen && 'outline-none ring-2 ring-offset-2 ring-indigo-500'}`}
                userId={user.id} 
                updatedAt={user.updatedAt} 
                navigateToUserProfile={false} 
                width={40} 
                height={40} 
                />
              </div>
            )}
            isOpen={isProfileMenuOpen}
            setIsOpen={(isOpen: boolean) => setProfileMenuOpen(isOpen)}
            >
              <UserProfileLink userId={user!.id}>
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
            </Dropdown>

          </div>
          
          {/* Mobile Menu Button */}
          <div className="hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <IconX className="h-6 w-6 text-gray-700" /> : <IconMenu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile Menu */}
      {/* {isMobileMenuOpen && (
        <div className="md:hidden">

          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative w-full p-2">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full bg-gray-100 border border-transparent rounded-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:bg-white"
                placeholder="Search..."
              />
            </div>
            <Link href={"/"} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"><Users /> Friends</Link>
            <Link href={"/"} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"><Bell /> Notifications</Link>
            <Link href={"/"} className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"><MessageSquare /> Chat</Link>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <img className="h-10 w-10 rounded-full object-cover" src={user.avatar!} alt={user.username} />
              <div className="ml-3">
                <p className="text-base font-medium text-gray-800">{user.username}</p>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link href={"/"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Your Profile</Link>
              <Link href={"/"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Settings</Link>
              <Link href={"/"} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Sign out</Link>
            </div>
          </div>

        </div>
      )} */}
    </nav>
  );
};

export default Navbar;