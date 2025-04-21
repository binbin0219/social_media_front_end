import React from 'react'
import SectionToggles from './SectionToggles'
import ProfileSection from './ProfileSection/ProfileSection'
import './style.css'
import Script from 'next/script'

const page = () => {
    return (
        <> 
            <Script src='/scripts/country-region-selector/crs.min.js' strategy="afterInteractive" />
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

export default page