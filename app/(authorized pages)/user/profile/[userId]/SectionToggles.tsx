import React, { memo } from 'react'

type Props = {
    setCurrentSection: React.Dispatch<React.SetStateAction<string>>
}

const SectionToggles = memo(({ setCurrentSection } : Props) => {
    return (
        <div className="w-full bg-white rounded-lg card-shadow">
            <div id="section_buttons_container" className="section-buttons-container flex gap-2 h-full w-fit mx-auto">
                <button 
                onClick={() => setCurrentSection('posts')} 
                data-data-loaded="true" 
                data-profile-section="posts_section" 
                type="button" 
                className={`posts-section-btn section-btn`}>
                    <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-inbox me-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                        <path d="M4 13h3l3 3h4l3 -3h3" />
                    </svg>
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
                    <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users me-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                    </svg>
                    Friends
                </button>
                <button 
                onClick={() => setCurrentSection('photos')} 
                disabled 
                data-data-loaded="false" 
                data-profile-section="photos_section" 
                type="button" 
                className={`photos-section-btn section-btn cursor-not-allowed`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle me-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 9v4" />
                        <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                        <path d="M12 16h.01" />
                    </svg>
                    Photos
                </button>
            </div>
        </div>
    )
});

SectionToggles.displayName = 'SectionToggles';
export default SectionToggles