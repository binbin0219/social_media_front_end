"use client"
import React from 'react'
import UserIcon from '../UserIcon/UserIcon'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import UserProfileLink from '../Link/UserProfileLink'
import { useDialogContext } from '@/context/DialogContext'
import CreatePostForm, { AttachmentUrlAndFile } from '../CreatePostForm/CreatePostForm'
import { postService } from '@/lib/services/post'
import { addPost } from '@/redux/slices/postSlice'
import { addToast } from '@/redux/slices/toastSlice'


const HomePageTag = () => {
    const currentUser = useSelector((state: RootState) => state.currentUser);
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

                    console.log("Upload successful!");
                    i++;
                }
            }

            dispatch(addPost(post));
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

    const handleOpenCreatePostDialog = () => {
        dialog.open(
            'Create post',
            <CreatePostForm onCancel={dialog.close} onSubmit={handleSubmit}/>,
        )
    }
    
    return (
        <form id="create_post_form" className={`create-post relative`} style={{transition: "all .3s linear"}}>
            <div className="flex gap-4 items-center cursor-pointer">
                <UserIcon userId={currentUser!.id} userAvatar={ currentUser!.avatar } />
                <div className="flex flex-col">
                    <UserProfileLink userId={currentUser!.id}>
                        <h4 className="font-bold hover:underline">Welcome! {currentUser && currentUser.username}</h4>
                    </UserProfileLink>
                    <h6 className="text-sm">Have something to share?</h6>
                </div>
            </div>
            <div className="gap-5 rounded-full p-3 items-center w-fit border-2 bg-green-200 border-green-400">
                <button id="show_create_post_btn" type="button" className={`flex gap-2 items-center`}
                    onClick={() => handleOpenCreatePostDialog()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#269950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 5l0 14" />
                        <path d="M5 12l14 0" />
                    </svg>
                </button>
            </div>
        </form>
    )
}

export default HomePageTag