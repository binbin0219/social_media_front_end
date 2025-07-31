import { addToast } from "@/redux/slices/toastSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import DynamicTooltip from "../Tooltip/DynamicToolTip";
import { IconMoodSmile, IconPhotoPlus } from "@tabler/icons-react";
import PostAttachments, { PostAttachmentPreview } from "../PostAttachments/PostAttachments";
import LoadingButton from "../LoadingButton/LoadingButton";

export type AttachmentUrlAndFile = {
    url: string, 
    file: File
}

type Props = {
    onSubmit?: (title: string, content: string, attachments: AttachmentUrlAndFile[]) => Promise<void>, 
    onCancel: () => void,
    enableAttachment?: boolean,
    openAttachmentInputAfterLoad?: boolean,
    initialData?: {
        title?: string,
        content?: string,
        attachments?: AttachmentUrlAndFile[]
    }
}

const CreatePostForm = ({onSubmit, onCancel, initialData, enableAttachment = true, openAttachmentInputAfterLoad}: Props) => {
    const dispatch = useDispatch();
    const MAX_TITLE_SIZE = 70;
    const MAX_CONTENT_SIZE = 2000;
    const [postAttachments, setPostAttachments] = useState<AttachmentUrlAndFile[]>([]);
    const [title, setTitle] = useState(initialData?.title ?? '');
    const [content, setContent] = useState(initialData?.content ?? '');
    const [isTitleValid, setIsTitleValid] = useState(true);
    const [isContentValid, setIsContentValid] = useState(true);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const isAttachmentInputClicked = useRef<boolean>(false);
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const attachmentLimit = 10;
    const attachments: PostAttachmentPreview[] = postAttachments.map(attachment => ({
        src: attachment.url,
        mimeType: attachment.file.type
    }));

    useEffect(() => {
        if(openAttachmentInputAfterLoad && 
            attachmentInputRef.current && 
            isAttachmentInputClicked.current === false
        ) {
            attachmentInputRef.current.click();
            isAttachmentInputClicked.current = true;
        }
    }, [openAttachmentInputAfterLoad])

    const handleSubmit = async () => {
        if(isCreatingPost) return;

        if(title.trim() === '') {
            setIsTitleValid(false);
        }

        if(content.trim() === '') {
            setIsContentValid(false);
        }

        if(title.trim() === '' || content.trim() === '') {
            return;
        }

        setIsCreatingPost(true);
        await onSubmit?.(title, content, postAttachments);
        setIsCreatingPost(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle.slice(0, MAX_TITLE_SIZE));
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent.slice(0, MAX_CONTENT_SIZE));
    };

    const handleAttachmentInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const files = e.currentTarget.files;
        if (!files) return;
        if((files.length + attachments.length) > attachmentLimit) {
            dispatch(addToast({
                message: "Cannot have more than 10 attachments",
                type: "error"
            }));
            return;
        }

        // Check file size
        for(const file of Array.from(files)) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if(file.size > MAX_FILE_SIZE) {
                dispatch(addToast({
                    message: "Maximum 5MB for each attachment",
                    type: "error"
                }));
                return;
            }
        }

        Array.from(files).forEach(file => {
            setPostAttachments(prev => [...prev, {
                url: URL.createObjectURL(file),
                file: file
            }]);
        })

        input.value = '';
    }

    const handleDelete = (currentAttachmentIndex: number) => {
        setPostAttachments(prev =>
            prev.filter((_, index) => index !== currentAttachmentIndex)
        );
    }

    return (
        <div className='w-[800px] flex flex-col gap-5 mt-3' style={{maxWidth: '100%'}}>
            <div className="relative">
                <input 
                value={title} 
                onChange={(e) => handleTitleChange(e)} 
                className={`w-full bg-slate-100 p-5 rounded-lg outline-none font-bold ${!isTitleValid && 'border-red-500 border'}`}
                name="title" 
                placeholder="Title" 
                type="text" 
                required/>
                <span className='text-xs text-slate-500 absolute end-0 bottom-0 me-2 mb-2'>{title.length} / {MAX_TITLE_SIZE}</span>
            </div>
            <div className={`bg-slate-100 rounded-lg p-3 ${!isContentValid && 'border-red-500 border'}`}>
                <textarea 
                className={`w-full bg-slate-100 outline-none resize-none`}
                value={content} 
                onChange={(e) => handleContentChange(e)} 
                name="content" 
                rows={5} 
                required 
                placeholder="Write something...">
                </textarea>
                <div className="w-full flex justify-end">
                    <span className='text-xs text-slate-500'>{content.length} / {MAX_CONTENT_SIZE}</span>
                </div>
                <div className='w-100 justify-end flex items-end mt-4'>
                    <div className='flex gap-4'>
                        <DynamicTooltip className="hidden" text='Emoji'>
                            <button type='button' className='hover:opacity-50'> 
                                <IconMoodSmile width={30} height={30}/>
                            </button>
                        </DynamicTooltip>
                        {enableAttachment && (
                            <DynamicTooltip text='Images/Videos'>
                                <label htmlFor='postImg' className='hover:opacity-50 cursor-pointer'> 
                                    <IconPhotoPlus width={30} height={30}/>
                                </label>
                                <input
                                ref={attachmentInputRef}
                                multiple
                                onInput={handleAttachmentInput}
                                id='postImg'
                                type="file"
                                accept="image/*, video/mp4"
                                className='hidden'
                                />
                            </DynamicTooltip>
                        )}
                    </div>
                </div>
            </div>
            {postAttachments.length > 0 && (
                <PostAttachments attachments={attachments} onDelete={handleDelete}/>
            )}
            <div className="flex gap-5 w-full justify-end mt-7">
                <button onClick={onCancel} className="bg-white border-black border-2 text-black px-3 py-2 rounded-lg font-bold hover:bg-black hover:text-white">
                    Cancel
                </button>
                <LoadingButton
                isLoading={isCreatingPost}
                loaderColor='white'
                onClick={handleSubmit}
                className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-800 flex gap-2 justify-center items-center"
                text={'Publish'}
                loadingText='Publishing...'
                />
            </div>
        </div>
    )
}

export default CreatePostForm;