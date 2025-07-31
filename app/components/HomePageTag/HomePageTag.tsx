"use client"
import React from 'react'
import UserIcon from '../UserIcon/UserIcon'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useDialogContext } from '@/context/DialogContext'
import CreatePostForm, { AttachmentUrlAndFile } from '../CreatePostForm/CreatePostForm'
import { postService } from '@/lib/services/post'
import { addPost } from '@/redux/slices/postSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { incrementPostCount } from '@/redux/slices/currentUserSlice'
import { IconPhoto, IconVideo } from '@tabler/icons-react'


const HomePageTag = () => {
    const currentUser = useSelector((state: RootState) => state.currentUser)!;
    const dialog = useDialogContext();
    const dispatch = useDispatch();

    const handleSubmit = async (title: string, content: string, attachments: AttachmentUrlAndFile[]) => {
        try {
            const formData = new FormData();
            formData.set('title', title);
            formData.set('content', content);
            attachments.forEach((attachment) => {
                formData.append('attachments[]', attachment.file);
            });

            const post = await postService.createPostOnServer(formData);
            post.user = currentUser;
            post.isNew = true;
            
            if(post.attachments && post.attachments.length > 0) {
                let i = 0;

                for(const attachment of post.attachments) {
                    const file = attachments[i].file;
                    if(!attachment.presignedUrl) continue;

                    const response = await fetch(attachment.presignedUrl, {
                        method: "PUT",
                        headers: {
                        "Content-Type": file.type,
                        },
                        body: file,
                    });

                    if(!response.ok) {
                        throw new Error("Failed to upload file");
                    }

                    i++;
                }
            }

            dispatch(addPost(post));
            dispatch(incrementPostCount());
            dispatch(addToast({
                type: 'success',
                message: 'Post created successfully'
            }));

            dialog.close();
        } catch (error) {
            console.error(error);
            dispatch(addToast({
                type: 'error',
                message: 'Failed to add post !'
            }));
        }
    };

    const handleOpenCreatePostDialog = (openAttachmentInputAfterLoad?: boolean) => {
        dialog.open(
            'Create post',
            <CreatePostForm onCancel={dialog.close} onSubmit={handleSubmit} openAttachmentInputAfterLoad={openAttachmentInputAfterLoad}/>,
        )
    }
    
    return (
        <div className="rounded-xl bg-white p-4 card-shadow">
            {/* Top section with the main CTA (same as above) */}
            <div className="flex items-center gap-3">
                <UserIcon userId={currentUser.id} updatedAt={currentUser.updatedAt} />
                <button
                    type="button"
                    onClick={() => handleOpenCreatePostDialog()}
                    className="flex-grow cursor-pointer rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-left text-gray-500 transition-all duration-200 hover:border-purple-400 hover:bg-purple-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    What&apos;s on your mind, {currentUser.username}?
                </button>
            </div>

            <hr className="my-4 border-t border-gray-200" />

            {/* Bottom section with vibrant action icons */}
            <div className="flex justify-around">
                <button
                    onClick={() => handleOpenCreatePostDialog(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-sky-600 transition-colors duration-200 hover:bg-sky-50"
                >
                    <IconPhoto />
                    Photo
                </button>
                <button
                    onClick={() => handleOpenCreatePostDialog(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-pink-600 transition-colors duration-200 hover:bg-pink-50"
                >
                    <IconVideo />
                    Video
                </button>
            </div>
        </div>
    )
}

export default HomePageTag