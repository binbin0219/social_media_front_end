import { addToast } from '@/redux/slices/toastSlice';
import { generateCurrentTime } from '@/utils/helpers';
import React, { memo, useRef } from 'react'
import { useDispatch } from 'react-redux';
import "croppie/croppie.css";
import Croppie from 'croppie';
import { useDialogContext } from '@/context/DialogContext';

type Props = {
    setCoverUrl: React.Dispatch<React.SetStateAction<string>>
}

const EditCoverInputComponent = ({ setCoverUrl }: Props) => {
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const coverCroppieContainerRef = useRef<HTMLDivElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleEditCover = () => {
        dialog.open(
            "Edit cover",
            (
                <div className="w-full flex justify-center overflow-x-auto">
                    <div ref={coverCroppieContainerRef} id="avatar_croppie"></div>
                </div>
            ), 
            'Confirm', 
            async () => {
                try {
                    const resultCover = await coverCroppie.result({
                        type: 'blob',
                        size: 'original',
                        format: 'png',
                    });
                    const formData = new FormData();
                    formData.append("image", resultCover, "cover-image.png")
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/cover/update`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    });
                    if(!response.ok) {
                        throw new Error('Failed to save cover image');
                    }
                    const data = await response.json();
                    setCoverUrl(data.coverPublicUrl + `?t=${generateCurrentTime()}`);
                    dispatch(addToast({
                        message: "Your cover image has been updated",
                        type: 'success'
                    }))
                } catch (error) {
                    console.error(error);
                    dispatch(addToast({
                        message: "Something went wrong",
                        type: 'error'
                    }))
                } finally {
                    dialog.close();
                    coverCroppie.destroy();
                    // Clear inputed image
                    if (coverInputRef.current) {
                        coverInputRef.current.value = '';
                    }
                }
            }
        )

        let coverCroppie : Croppie;
        setTimeout(() => {
            if(coverCroppieContainerRef.current) {
                coverCroppie = new Croppie(coverCroppieContainerRef.current, {
                    enableOrientation: true,
                    viewport: {
                        width: 400,
                        height: 200,
                        type: 'square'
                    },
                    boundary: {
                        width: 500,
                        height: 500
                    }
                });
                
                if(!coverInputRef.current || !coverInputRef.current.files) throw new Error("Cover input element or the image uploaded is missing");
                coverCroppie.bind({
                    url: URL.createObjectURL(coverInputRef.current.files[0])
                });
            } else {
                
            }
        }, 25);
    }

    return (
        <>
            <label id="edit_cover_btn" htmlFor="edit_cover_input" className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer">
                <svg style={{pointerEvents: "none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-camera inline">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                    <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                </svg>
            </label>
            <input ref={coverInputRef} onInput={() => handleEditCover()} type="file" accept="image/*" name="edit_cover_input" id="edit_cover_input" className="hidden"></input>
        </>
    )
};

const EditCoverInput = memo(EditCoverInputComponent);

export default EditCoverInput;