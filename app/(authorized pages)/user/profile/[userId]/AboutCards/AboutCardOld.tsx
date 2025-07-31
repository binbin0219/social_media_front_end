import { User } from '@/lib/models/user'
import React from 'react'

type Props = {
    profileUser: User
}

const AboutCardOld = ({profileUser}: Props) => {
    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-800 pb-4 mb-6 border-b border-gray-200">About</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">

                {/* Name */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-signature">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 17c3.333 -3.333 5 -6 5 -8c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 4.877 2.5 6c1.5 2 2.5 2.5 3.5 1l2 -3c.333 2.667 1.333 4 3 4c.53 0 2.639 -2 3 -2c.517 0 1.517 .667 3 2" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Name</h4>
                        {!profileUser?.firstName && !profileUser?.lastName ? (
                            <p className="text-gray-500 italic">Unknown</p>
                        ) : (
                            <p className="text-gray-900">{profileUser?.firstName} {profileUser?.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Gender */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-gender-male">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                            <path d="M19 5l-5.4 5.4" />
                            <path d="M19 5h-5" />
                            <path d="M19 5v5" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Gender</h4>
                        <p className="text-gray-900">{profileUser?.gender || "Unknown"}</p>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Location</h4>
                        {profileUser?.country ?
                            <p className="text-gray-900">From {profileUser.country}{profileUser.region ? `, ${profileUser.region}` : ""}</p>
                        :
                            <p className="text-gray-500 italic">Unknown</p>
                        }
                    </div>
                </div>

                {/* Relationship */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Relationship</h4>
                        <p className="text-gray-900">{profileUser?.relationshipStatus || "Unknown"}</p>
                    </div>
                </div>

                {/* Occupation */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-briefcase">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                            <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                            <path d="M12 12l0 .01" />
                            <path d="M3 13a20 20 0 0 0 18 0" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Occupation</h4>
                        <p className="text-gray-900">{profileUser?.occupation || "Unknown"}</p>
                    </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-mobile">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14z" />
                            <path d="M11 4h2" />
                            <path d="M12 17v.01" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700">Phone Number</h4>
                        {profileUser?.phoneNumber?.dialCode && profileUser?.phoneNumber?.phoneNumberBody ?
                            <p className="text-gray-900">+{profileUser.phoneNumber.dialCode} {profileUser.phoneNumber.phoneNumberBody}</p>
                        :
                            <p className="text-gray-500 italic">Unknown</p>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AboutCardOld