import { User } from '@/lib/models/user';
import { Briefcase, Heart, MapPin, Phone, UserRound, VenusAndMars } from 'lucide-react';
import React, { ReactNode } from 'react';

type InfoItemProps = {
    icon: ReactNode;
    label: string;
    children: ReactNode;
};

const ModernInfoItem: React.FC<InfoItemProps> = ({ icon, label, children }) => (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-borderPrimary bg-bgPrimary p-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bgHoverPrimary text-appPrimary">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-textPrimary/50">{label}</p>
            <p className="break-words text-sm font-semibold text-textPrimary">{children}</p>
        </div>
    </div>
);

const StatTile = ({ label, value }: { label: string; value: number | null }) => (
    <div className="rounded-xl border border-borderPrimary bg-bgPrimary p-3">
        <p className="text-xl font-bold text-textPrimary">{value ?? 0}</p>
        <p className="mt-0.5 text-xs font-medium text-textPrimary/60">{label}</p>
    </div>
);

const AboutCard = ({ profileUser }: {profileUser: User}) => {
    return (
        <div className="w-full mx-auto flex flex-col overflow-hidden rounded-2xl bg-bgSecondary border border-borderPrimary shadow-sm">
            <div className="p-5 border-b border-borderPrimary">
                <p className="text-xs font-bold uppercase text-appPrimary">Profile</p>
                <h1 className="mt-1 text-xl font-bold text-textPrimary">Information</h1>
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <StatTile label="Posts" value={profileUser.postCount} />
                    <StatTile label="Friends" value={profileUser.friendCount} />
                    <StatTile label="Likes" value={profileUser.likeCount} />
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 gap-3">

                <ModernInfoItem 
                    label="Name" 
                    icon={<UserRound size={20} />}
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
                    icon={<VenusAndMars size={20} />}
                >
                    {profileUser?.gender || "Unknown"}
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Location" 
                    icon={<MapPin size={20} />}
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
                    icon={<Heart size={20} />}
                >
                    {!profileUser?.relationshipStatus || profileUser?.relationshipStatus?.trim() === "" ? "Unknown" : profileUser?.relationshipStatus}
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Occupation" 
                    icon={<Briefcase size={20} />}
                >
                    {!profileUser?.occupation || profileUser?.occupation?.trim() === "" ? "Unknown" : profileUser?.occupation}
                </ModernInfoItem>

                <ModernInfoItem 
                    label="Phone Number" 
                    icon={<Phone size={20} />}
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
