import { User } from '@/lib/models/user';
import React, { ReactNode } from 'react';

type InfoItemProps = {
    icon: ReactNode;
    label: string;
    children: ReactNode;
};

const ModernInfoItem: React.FC<InfoItemProps> = ({ icon, label, children }) => (
    <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base font-semibold text-gray-800">{children}</p>
        </div>
    </div>
);

const AboutCard = ({ profileUser }: {profileUser: User}) => {
    return (
        <div className="w-full mx-auto flex flex-col rounded-2xl bg-white shadow-lg">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">
                    Profile Information
                </h1>
            </div>

            {/* Grid for Info Items with more spacing */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                <ModernInfoItem 
                    label="Name" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 17c3.333 -3.333 5 -6 5 -8c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 4.877 2.5 6c1.5 2 2.5 2.5 3.5 1l2 -3c.333 2.667 1.333 4 3 4c.53 0 2.639 -2 3 -2c.517 0 1.517 .667 3 2" />
                        </svg>
                    }
                >
                    {/* Both unavaileble */}
                    {(!profileUser?.firstName || profileUser.firstName.trim() == "") && (!profileUser?.lastName || profileUser.lastName.trim() == "") &&
                        "Unknown"
                    }

                    {/* Both available */}
                    {(profileUser?.firstName && profileUser.firstName.trim() !== "") && (profileUser?.lastName && profileUser.lastName.trim() !== "") &&
                        `${profileUser.firstName} ${profileUser.lastName}`
                    }

                    {/* Only firstName available */}
                    {(profileUser?.firstName && profileUser.firstName.trim() !== "") && (!profileUser?.lastName || profileUser.lastName.trim() == "") &&
                        profileUser.firstName
                    }

                    {/* Only lastName available */}
                    {(!profileUser?.firstName || profileUser.firstName.trim() == "") && (profileUser?.lastName && profileUser.lastName.trim() !== "") &&
                        profileUser.lastName
                    }
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Gender" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                            <path d="M19 5l-5.4 5.4" />
                            <path d="M19 5h-5" />
                            <path d="M19 5v5" />
                        </svg>
                    }
                >
                    {profileUser?.gender || "Unknown"}
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Location" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                        </svg>
                    }
                >
                    {profileUser?.country && profileUser.country.trim() !== ""
                        ? `From ${profileUser?.country}` 
                        : "Unknown"
                    }
                    {profileUser?.region && profileUser.region.trim() !== ""
                        ? `, ${profileUser?.region}` 
                        : ""
                    }
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Relationship" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                        </svg>
                    }
                >
                    {!profileUser?.relationshipStatus || profileUser?.relationshipStatus?.trim() === "" ? "Unknown" : profileUser?.relationshipStatus}
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Occupation" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                                <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                                <path d="M12 12l0 .01" />
                                <path d="M3 13a20 20 0 0 0 18 0" />
                        </svg>
                    }
                >
                    {!profileUser?.occupation || profileUser?.occupation?.trim() === "" ? "Unknown" : profileUser?.occupation}
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Phone Number" 
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14z" />
                            <path d="M11 4h2" />
                            <path d="M12 17v.01" />
                        </svg>
                    }
                >
                    {profileUser?.phoneNumber 
                        ? `+${profileUser?.phoneNumber.dialCode} ${profileUser?.phoneNumber.phoneNumberBody}` 
                        : "Unknown"
                    }
                </ModernInfoItem>

            </div>
        </div>
    );
};

export default AboutCard;