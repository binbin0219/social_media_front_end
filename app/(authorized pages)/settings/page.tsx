import React from 'react'
import SectionToggles from './SectionToggles'
import ProfileSection from './ProfileSection/ProfileSection'
import './style.css'

const page = () => {
    return (
        <> 
            <div 
            className="
                settings-page
                flex-col
                text-textPrimary
                md:mt-[70px] md:max-w-[1200px] md:w-full md:mx-auto md:flex md:items-start md:justify-center md:flex-row
            ">
                <SectionToggles/>
                <div 
                className="
                    flex flex-col p-4 w-full sm:p-8 md:p-10
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
