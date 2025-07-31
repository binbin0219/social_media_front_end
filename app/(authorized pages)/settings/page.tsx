import React from 'react'
import SectionToggles from './SectionToggles'
import ProfileSection from './ProfileSection/ProfileSection'
import './style.css'

const page = () => {
    return (
        <> 
            <div 
            className="
                flex-col
                md:mt-[70px] md:max-w-[1000px] md:w-full md:mx-auto md:flex md:items-center md:justify-center md:flex-row
            ">
                <SectionToggles/>
                <div 
                className="
                    flex flex-col p-10 w-full 
                    md:pt-[80px]
                ">
                    <ProfileSection/>
                </div>
            </div>
        </>
    )
}

export const dynamic = 'force-dynamic';
export default page