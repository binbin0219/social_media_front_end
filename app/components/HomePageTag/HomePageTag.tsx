"use client"
import React from 'react'
import UserIcon from '../UserIcon/UserIcon'
import './style.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useDialogContext } from '@/context/DialogContext'
import CreatePostForm from '../CreatePostForm/CreatePostForm'
import { postService } from '@/lib/services/post'
import { addPost } from '@/redux/slices/postSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { incrementPostCount } from '@/redux/slices/currentUserSlice'
import { IconPhoto, IconVideo } from '@tabler/icons-react'
import { CreateEditPost } from '@/lib/models/post'

const HomePageTag = () => {
    const currentUser = useSelector((state: RootState) => state.currentUser)!;
    const dialog = useDialogContext();
    const dispatch = useDispatch();

    const handleSubmit = async ({
        content,
        attachments,
        privacySetting,
        commentStatus,
        isSensitive,
        selectedFriends,
    }: CreateEditPost) => {
        try {
            const formData = new FormData();
            formData.set('content', content);
            formData.set('privacySetting', privacySetting);
            formData.set('commentStatus', commentStatus);
            formData.set('isSensitive', isSensitive ? 'true' : 'false');

            selectedFriends.forEach((friend) => {
                formData.append('selectedFriendIds[]', friend.id.toString());
            });

            attachments.forEach((attachment) => {
                formData.append('attachments[]', attachment.file);
            });

            const post = await postService.createPostOnServer(formData);
            post.user = currentUser;
            post.isNew = true;

            if (post.attachments?.length) {
                let i = 0;

                for (const attachment of post.attachments) {
                    const file = attachments[i].file;
                    if (!attachment.presignedUrl) continue;

                    const response = await fetch(attachment.presignedUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": file.type,
                        },
                        body: file,
                    });

                    if (!response.ok) {
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
            null,
            <CreatePostForm
                onCancel={dialog.close}
                onSubmit={handleSubmit}
                openAttachmentInputAfterLoad={openAttachmentInputAfterLoad}
            />,
        );
    };

    return (
        <div className="rounded-xl bg-bgSecondary p-4 border border-borderPrimary">
            {/* Top CTA */}
            <div className="flex items-center gap-3">
                <UserIcon
                    userId={currentUser.id}
                    updatedAt={currentUser.updatedAt}
                />

                <button
                    type="button"
                    onClick={() => handleOpenCreatePostDialog()}
                    className="
                        flex-grow cursor-pointer rounded-full
                        border border-borderPrimary
                        bg-bgSecondary
                        px-4 py-3 text-left
                        text-textSecondary
                        transition-all duration-200
                        hover:bg-bgHoverPrimary
                        hover:text-textPrimary
                        focus:outline-none focus:ring-2 focus:ring-appPrimary
                    "
                >
                    What&apos;s on your mind, {currentUser.username}?
                </button>
            </div>

            <hr className="my-4 border-borderPrimary" />

            {/* Actions */}
            <div className="flex justify-around">
                <button
                    onClick={() => handleOpenCreatePostDialog(true)}
                    className="
                        flex w-full items-center justify-center gap-2
                        rounded-lg py-2 text-sm font-semibold
                        text-appPrimary
                        transition-colors duration-200
                        hover:bg-bgHoverPrimary
                    "
                >
                    <IconPhoto />
                    Photo
                </button>

                <button
                    onClick={() => handleOpenCreatePostDialog(true)}
                    className="
                        flex w-full items-center justify-center gap-2
                        rounded-lg py-2 text-sm font-semibold
                        text-appSecondary
                        transition-colors duration-200
                        hover:bg-bgHoverSecondary
                    "
                >
                    <IconVideo />
                    Video
                </button>
            </div>
        </div>
    );
};

export default HomePageTag;