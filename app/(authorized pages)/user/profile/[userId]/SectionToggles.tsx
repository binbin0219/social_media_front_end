import React, { memo } from 'react'
import { ImageOff, Inbox, Users } from 'lucide-react'

type Props = {
    setCurrentSection: React.Dispatch<React.SetStateAction<string>>
}

const SectionToggles = memo(({ setCurrentSection } : Props) => {
    return (
        <div className="w-full rounded-xl border border-borderPrimary bg-bgSecondary p-1.5 shadow-sm">
            <div id="section_buttons_container" className="section-buttons-container grid h-full grid-cols-3 gap-1">
                <button 
                onClick={() => setCurrentSection('posts')} 
                data-data-loaded="true" 
                data-profile-section="posts_section" 
                type="button" 
                className={`posts-section-btn section-btn`}>
                    <Inbox size={18} />
                    Posts
                </button>
                {/* <button 
                onClick={() => setCurrentSection('about')} 
                data-data-loaded="true" 
                data-profile-section="about_section" 
                type="button" 
                className={`about-section-btn section-btn`}>
                    <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-id me-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                        <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M15 8l2 0" />
                        <path d="M15 12l2 0" />
                        <path d="M7 16l10 0" />
                    </svg>
                    About
                </button> */}
                <button 
                onClick={() => setCurrentSection('friends')} 
                data-data-loaded="false" 
                data-profile-section="friends_section" 
                type="button" 
                className={`friends-section-btn section-btn`}>
                    <Users size={18} />
                    Friends
                </button>
                <button 
                onClick={() => setCurrentSection('photos')} 
                disabled 
                data-data-loaded="false" 
                data-profile-section="photos_section" 
                type="button" 
                className={`photos-section-btn section-btn cursor-not-allowed`}>
                    <ImageOff size={18} />
                    Photos
                </button>
            </div>
        </div>
    )
});

SectionToggles.displayName = 'SectionToggles';
export default SectionToggles
