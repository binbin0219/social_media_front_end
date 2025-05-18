"use client"
import { IconSearch } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'
import UserLazyLoadList from '../UserLazyLoadList/UserLazyLoadList';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchResultList, setSearchResultList] = useState<React.JSX.Element | null>(null);
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
    const searchInputRef = useRef(null);
    const router = useRouter();

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);

        if(value.trim() === "") {
            setSearchResultList(null)
        } else {
            setSearchResultList((
                <UserLazyLoadList 
                className='absolute top-100 p-2 bg-white shadow-lg w-full rounded max-h-300px overflow-y-auto'
                key={value} 
                username={value} 
                onItemClick={(result) => router.push(`/user/profile/${result.id}`)}
                />
            ))
        }
    }

    return (
        <div className='relative w-[250px]'>
            <input 
            ref={searchInputRef} 
            onChange={(e) => handleSearchInput(e)} 
            onFocus={() => setIsSearchInputFocused(true)}
            onBlur={() => setTimeout(() => {
                setIsSearchInputFocused(false);
            }, 150)}
            value={searchInput} 
            type="text" 
            className='rounded-3xl p-1 border indent-8 outline-none w-full' 
            placeholder='Search...' 
            />
            <IconSearch width={20} height={20} className='absolute top-[6px] start-[10px]'/>
            <div className={`${!isSearchInputFocused && 'hidden'}`}>
                {searchResultList}
            </div>
        </div>
    )
}

export default SearchBar