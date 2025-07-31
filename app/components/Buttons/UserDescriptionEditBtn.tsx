import { useDialogContext } from '@/context/DialogContext'
import { IconPencil } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'
import SmartTextArea from '../SmartTextArea';
import { updateUserProfileOnServer } from '@/lib/services/user';
import { useDispatch } from 'react-redux';
import { addToast } from '@/redux/slices/toastSlice';

type Props = {
    description: string;
    onDone: (newDes: string) => void;
}

const UserDescriptionEditBtn = ({ description: initialDescription, onDone }: Props) => {
    const dispatch = useDispatch();
    const dialog = useDialogContext();
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleClick = async () => {
        try {
            dialog.open(
                'Edit Description',
                <DialogBody/>,
                'Done',
                async () => {
                    try {
                        const newDes = inputRef!.current!.value;
                        await updateUserProfileOnServer({
                            description: newDes
                        });
                        onDone(newDes);
                        dialog.close();
                        dispatch(addToast({
                            message: "Updated description successfully",
                            type: 'success'
                        }))
                    } catch (error) {
                        console.log(error);
                        dispatch(addToast({
                            message: "Failed to edit description",
                            type: 'error'
                        }))
                    }
                }
            )
        } catch (error) {
            console.log(error);
            dispatch(addToast({
                message: "Failed to edit description, please try again!",
                type: 'error'
            }))
        }
    }

    const DialogBody = () => {
        const [description, setDescription] = useState(initialDescription);
        
        return (
            <>
                <SmartTextArea 
                ref={inputRef}
                className='w-[700px] max-w-full border rounded outline-none p-2 mt-3'
                value={description}
                setter={setDescription}
                name='description'
                placeholder='Enter your description...'
                min={0}
                max={500}
                rows={7}
                disabledInputKeys={[]}
                />
            </>
        )
    }

    return (
        <button onClick={handleClick} className='text-blue-700'>
            <IconPencil/>
        </button>
    )
}

export default UserDescriptionEditBtn