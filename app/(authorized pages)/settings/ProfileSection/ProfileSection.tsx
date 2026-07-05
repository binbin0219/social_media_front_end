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
import { updateUserProfileOnServer } from '@/lib/services/user'
import LoadingButton from '@/components/LoadingButton/LoadingButton'
import { mediaService } from '@/lib/services/media'

type EditableProfileData = Omit<Partial<User>, 'avatar' | 'background'> & {
    avatar?: string | null;
};

const ProfileSection = () => {
    const dispatch = useDispatch();
    // Only load partial of current user data that can be edited
    const currentUser: User = useSelector((state: RootState) => state.currentUser)!;
    const [originalUserData, setOriginalUserData] = useState<EditableProfileData>();
    const [editingUserData, setEditingUserData] = useState<EditableProfileData>({});
    const [editedUserData, setEditedUserData] = useState<EditableProfileData>({});
    const [isSaving, setSaving] = useState(false);
    const isEdited = editedUserData && Object.keys(editedUserData).length > 0;

    useEffect(() => {
        const editableData: EditableProfileData = {
            avatar: currentUser.avatar?.url ?? null,
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
    }, [currentUser]);

    useEffect(() => {
        const changes: EditableProfileData = {};
        const changedFields = changes as Record<string, unknown>;

        for (const key in editingUserData) {
            const oldVal = originalUserData?.[key as keyof EditableProfileData];
            const newVal = editingUserData[key as keyof EditableProfileData];

            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                changedFields[key] = newVal;
            }
        }

        if (JSON.stringify(changes) !== JSON.stringify(editedUserData)) {
            setEditedUserData(changes);
        }
    }, [editingUserData, originalUserData, editedUserData]);

    const updateUserField = (field: string, value: unknown) => {
        setEditingUserData(prev => ({
            ...prev!,
            [field]: value,
        }));
    };

    const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type || 'image/png' });
    }

    const handleSave = async () => {
        try {
            if(isSaving) return;
            setSaving(true);
            const { avatar, ...profileChanges } = editedUserData;
            const reduxChanges: Partial<User> = { ...profileChanges };
            const updatePayload: Record<string, unknown> = { ...profileChanges };

            if (avatar) {
                const avatarFile = await dataUrlToFile(avatar, 'avatar.png');
                const uploadedAvatar = await mediaService.createMedia(avatarFile);
                updatePayload.avatarId = uploadedAvatar.id;
                reduxChanges.avatar = uploadedAvatar;
            }

            await updateUserProfileOnServer(updatePayload);
            dispatch(updateProfile(reduxChanges));
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
        <div>
            <div className="pb-5">
                <p className="text-sm font-bold uppercase text-appPrimary">Settings</p>
                <h1 className="mt-1 font-extrabold text-3xl text-textPrimary sm:text-4xl">Public Profile</h1>
                <p className="mt-2 text-sm text-textPrimary/60">Update the details people see on your profile.</p>
            </div>
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
                    ${!isEdited ? 'bg-bgHoverSecondary border-borderPrimary text-textPrimary/55' : ''}
                    ${isEdited ? 'bg-bgHoverPrimary border-appPrimary text-appPrimary hover:bg-bgHoverSecondary' : ''}
                    border-2 px-3 py-2 rounded-lg flex gap-2 relative transition-colors
                `}
                >
                </LoadingButton>
            </div>
        </div>
    )
}

export default ProfileSection
