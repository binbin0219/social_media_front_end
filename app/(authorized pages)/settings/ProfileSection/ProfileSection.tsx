"use client"
import { RootState } from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import AvatarChanger from './AvatarChanger'
import DetailsChanger from './DetailsChanger'
import { User } from '@/lib/models/user'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { addToast } from '@/redux/slices/toastSlice'
import { updateProfile } from '@/redux/slices/currentUserSlice'

const ProfileSection = () => {
    const dispatch = useDispatch();
    // Only load partial of current user data that can be edited
    const currentUser: Partial<User> = useSelector(
        (state: RootState) => ({
            avatar: state.currentUser?.avatar,
            username: state.currentUser?.username,
            firstName: state.currentUser?.firstName,
            lastName: state.currentUser?.lastName,
            gender: state.currentUser?.gender,
            country: state.currentUser?.country,
            region: state.currentUser?.region,
            relationshipStatus: state.currentUser?.relationshipStatus,
            occupation: state.currentUser?.occupation,
            phoneNumber: state.currentUser?.phoneNumber,
        }),
        shallowEqual
    );
    const [clonedUserData, setClonedUserData] = useState<Partial<User>>(structuredClone(currentUser));
    const [editedUserData, setEditedUserData] = useState<Partial<User>>({});
    const isEdited = editedUserData && Object.keys(editedUserData).length > 0;

    useEffect(() => {
        const changes: Partial<User> = {};

        for (const key in clonedUserData) {
            const oldVal = currentUser[key as keyof User];
            const newVal = clonedUserData[key as keyof User];

            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                changes[key as keyof User] = newVal;
            }
        }

        if (JSON.stringify(changes) !== JSON.stringify(editedUserData)) {
            setEditedUserData(changes);
        }
    }, [clonedUserData, currentUser, editedUserData]);


    const updateUserField = (field: string, value: unknown) => {
        setClonedUserData(prev => ({
            ...prev!,
            [field]: value,
        }));
    };

    const updateUserDataOnServer = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/update`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...editedUserData
            })
        });
        if (!response.ok) {
            throw new Error("Failed to update user data on server");
        }
    }

    const handleSave = async () => {
        try {
            await updateUserDataOnServer();
            dispatch(updateProfile(editedUserData));
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
        }
    }

    return (
        <>
            <h1 className="font-extrabold text-4xl">Public Profile</h1>
            <AvatarChanger
                avatar={clonedUserData?.avatar}
                updateUserData={updateUserField}
            />
            <DetailsChanger
                user={clonedUserData}
                updateUserData={updateUserField}
            />
            <div className="w-full flex justify-end mt-7">
                <button
                    onClick={() => handleSave()}
                    disabled={!isEdited}
                    id="save_changes_btn"
                    className={`
                ${!isEdited ? 'bg-slate-100 border-slate-300 text-slate-600' : ''}
                ${isEdited ? 'bg-green-100 border-green-300 text-green-600 hover:bg-green-200' : ''}
                border-2  px-3 py-2 rounded-lg flex gap-2 relative
                `}>
                    <IconDeviceFloppy />
                    Save Changes
                </button>
            </div>
        </>
    )
}

export default ProfileSection