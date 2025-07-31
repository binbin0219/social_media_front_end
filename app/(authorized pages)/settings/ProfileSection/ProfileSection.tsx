"use client"
import { RootState } from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AvatarChanger from './AvatarChanger'
import DetailsChanger from './DetailsChanger'
import { User } from '@/lib/models/user'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { addToast } from '@/redux/slices/toastSlice'
import { updateProfile } from '@/redux/slices/currentUserSlice'
import { getUserAvatarLink, updateUserProfileOnServer } from '@/lib/services/user'
import LoadingButton from '@/components/LoadingButton/LoadingButton'

const ProfileSection = () => {
    const dispatch = useDispatch();
    // Only load partial of current user data that can be edited
    const currentUser: User = useSelector((state: RootState) => state.currentUser)!;
    const [originalUserData, setOriginalUserData] = useState<Partial<User>>();
    const [editingUserData, setEditingUserData] = useState<Partial<User>>({});
    const [editedUserData, setEditedUserData] = useState<Partial<User>>({});
    const [isSaving, setSaving] = useState(false);
    const isEdited = editedUserData && Object.keys(editedUserData).length > 0;

    // Fetch avatar base64 from currentUser.id, currentUser.updatedAt
    useEffect(() => {
        imageUrlToBase64(getUserAvatarLink(currentUser.id, currentUser.updatedAt))
        .then(avatarBase64 => {
            const editableData = {
                avatar: avatarBase64,
                username: currentUser.username,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                gender: currentUser.gender,
                country: currentUser.country,
                region: currentUser.region,
                relationshipStatus: currentUser.relationshipStatus,
                occupation: currentUser.occupation,
                phoneNumber: currentUser.phoneNumber,
            }

            setOriginalUserData(editableData);
            setEditingUserData(editableData);
        })
    }, [currentUser]);

    useEffect(() => {
        const changes: Partial<User> = {};

        for (const key in editingUserData) {
            const oldVal = originalUserData?.[key as keyof User];
            const newVal = editingUserData[key as keyof User];

            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                changes[key as keyof User] = newVal;
            }
        }

        if (JSON.stringify(changes) !== JSON.stringify(editedUserData)) {
            setEditedUserData(changes);
        }
    }, [editingUserData, originalUserData, editedUserData]);

    const imageUrlToBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to convert blob to base64."));
            }
            };

            reader.onerror = reject;

            reader.readAsDataURL(blob); // Converts blob to base64 (data URL)
        });
    }

    const updateUserField = (field: string, value: unknown) => {
        setEditingUserData(prev => ({
            ...prev!,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            if(isSaving) return;
            setSaving(true);
            await updateUserProfileOnServer(editedUserData);
            dispatch(updateProfile(editedUserData));
            setOriginalUserData(editingUserData);
            setEditedUserData({});
            dispatch(addToast({
                message: 'Saved successfully',
                type: 'success'
            }));
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                message: 'Failed to save changes, please try again',
                type: 'error'
            }));
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <h1 className="font-extrabold text-4xl">Public Profile</h1>
            <AvatarChanger
                avatar={editingUserData?.avatar}
                updateUserData={updateUserField}
            />
            <DetailsChanger
                user={editingUserData}
                updateUserData={updateUserField}
            />
            <div className="w-full flex justify-end mt-7">
                <LoadingButton
                isLoading={isSaving}
                loaderColor='#475569'
                loaderWidth={24}
                onClick={() => handleSave()}
                text={(
                    <>
                        <IconDeviceFloppy />
                        Save Changes
                    </>
                )}
                loadingText='Saving...'
                disabled={!isEdited}
                className={`
                    ${!isEdited ? 'bg-slate-100 border-slate-300 text-slate-600' : ''}
                    ${isEdited ? 'bg-green-100 border-green-300 text-green-600 hover:bg-green-200' : ''}
                    border-2 px-3 py-2 rounded-lg flex gap-2 relative
                `}
                >
                </LoadingButton>
            </div>
        </>
    )
}

export default ProfileSection