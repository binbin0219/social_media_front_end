import LoadingButton from '@/components/LoadingButton/LoadingButton';
import { useDialogContext } from '@/context/DialogContext';
import { addToast } from '@/redux/slices/toastSlice';
import { RootState } from '@/redux/store';
import { IconArrowsShuffle, IconUpload } from '@tabler/icons-react'
import Croppie from 'croppie';
import "croppie/croppie.css";
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    avatar?: string | null;
    updateUserData: (field: string, value: unknown) => void;
}

const AvatarChanger = ({avatar, updateUserData} : Props) => {
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const avatarCroppieContainerRef = useRef<HTMLDivElement>(null);
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const randomAvatarBtnRef = useRef<HTMLButtonElement>(null);
    const [isFetchingRandomAvatar, setFetchingRandomAvatar] = useState(false);

    const handleImgUpload = () => {
        dialog.open(
            "Edit cover",
            (
                <div className="w-full flex justify-center overflow-x-auto">
                    <div ref={avatarCroppieContainerRef} id="avatar_croppie"></div>
                </div>
            ), 
            'Confirm', 
            async () => {
                try {
                    const resultAvatar = await avatarCroppie.result({
                        type: 'base64',
                        size: 'viewport',
                        format: 'png',
                    });
                    updateUserData("avatar", resultAvatar);
                } catch (error) {
                    console.log(error);
                    dispatch(addToast({
                        message: "Failed to upload avatar",
                        type: 'error'
                    }));
                } finally {
                    dialog.close();
                    avatarCroppie.destroy();
                    if (avatarInputRef.current) {
                        avatarInputRef.current.value = '';
                    }
                }
            }
        )

        let avatarCroppie: Croppie;
        setTimeout(() => {
            avatarCroppie = initializeAvatarCroppie(avatarCroppieContainerRef.current!);
        }, 25);
    };

    const initializeAvatarCroppie = (element: HTMLElement): Croppie => {
        const avatarCroppie = new Croppie(element, {
            enableOrientation: true,
            viewport: {
                width: 200,
                height: 200,
                type: 'circle'
            },
            boundary: {
                width: 500,
                height: 500
            }
        });
        
        if(!avatarInputRef.current || !avatarInputRef.current.files) throw new Error("Cover input element or the image uploaded is missing");
        avatarCroppie.bind({
            url: URL.createObjectURL(avatarInputRef.current.files[0])
        });

        return avatarCroppie;
    }

    const handleRandomAvatar = async () => {
        try {
            if(isFetchingRandomAvatar) return;
            setFetchingRandomAvatar(true);
            if(randomAvatarBtnRef.current) {
                randomAvatarBtnRef.current.classList.add('button-disabled');
            }

            const randomAvatarBase64 = await fetchRandomAvatarBase64();
            updateUserData("avatar", randomAvatarBase64);
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                message: 'Failed to generate random avatar, please try again',
                type: 'error'
            }));
        } finally {
            if(randomAvatarBtnRef.current) {
                randomAvatarBtnRef.current.classList.remove('button-disabled');
            }
            setFetchingRandomAvatar(false);
        }
    }

    const fetchRandomAvatarBase64 = async (): Promise<string> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/avatar/random?gender=${currentUser?.gender}`, {
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error("Failed to fetch random avatar from server");
        }
        const data = await response.json();
        return data.image;
    }

    return (
        <div className="flex gap-7 mt-8 justify-center">
            {avatar && (
                <Image 
                    width={100}
                    height={100}
                    src={avatar!}
                    alt={'image'}
                />
            )}
            <div className="flex flex-col gap-3">
                <label htmlFor="upload_img_input" className="flex gap-2 items-center rounded-lg px-3 py-2 border-2 border-green-300 bg-green-100 text-sm text-green-600 hover:bg-green-200 cursor-pointer">
                    <IconUpload/>
                    Upload image
                    <input onInput={() => handleImgUpload()} ref={avatarInputRef} id="upload_img_input" accept="image/jpeg, image/png" type="file" name="avatar" className="hidden"/>
                </label>
                <LoadingButton
                isLoading={isFetchingRandomAvatar}
                loaderColor='#4f46e5'
                onClick={() => handleRandomAvatar()}
                text={(
                    <>
                        <IconArrowsShuffle/>
                        Random Avatar
                    </>
                )}
                loadingText='Generating...'
                className='flex gap-2 items-center rounded-lg px-3 py-2 border-2 border-indigo-300 bg-indigo-100 text-sm text-indigo-600 hover:bg-indigo-200'
                >
                </LoadingButton>
            </div>
        </div>
    )
}

export default AvatarChanger