import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Tooltip from '../Tooltip/Tooltip';
import { IconAlertCircle, IconChevronLeft, IconChevronRight, IconTrash } from '@tabler/icons-react';

type Props = {
    attachments: Array<PostAttachmentPreview>,
    onDelete?: (currentAttachmentIndex: number) => void;
}

export type PostAttachmentPreview = {
    src: string,
    mimeType: string
}

const PostAttachments = ({attachments, onDelete}: Props) => {
    const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(-1);
    const isAtFirstAttachment = currentAttachmentIndex === 0;
    const isAtLastAttachment = currentAttachmentIndex === attachments.length - 1;
    const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());

    useEffect(() => {
        if(currentAttachmentIndex === -1 && (attachments.length > 0)) {
            setCurrentAttachmentIndex(0);
        } else if ((currentAttachmentIndex + 1) > attachments.length) {
            setCurrentAttachmentIndex(attachments.length - 1)
        }

    }, [attachments.length, currentAttachmentIndex]);

    const handleFail = (index: number) => {
        setFailedIndexes(prev => new Set(prev).add(index));
    };

    const renderFallback = (index: number) => (
        <div key={index} className={`flex flex-col gap-2 items-center justify-center w-full h-[400px] bg-gray-100 text-gray-500 ${index !== currentAttachmentIndex && 'hidden'}`}>
            <IconAlertCircle size={40}/>
            <p>Failed to load media</p>
        </div>
    );

    const handleNext = () => {
        setCurrentAttachmentIndex(Math.min(currentAttachmentIndex + 1, attachments.length - 1));
    }

    const handleBack = () => {
        setCurrentAttachmentIndex(Math.max(currentAttachmentIndex - 1, 0));
    }

    return (
        <div className='relative'>
            {attachments.map((attachment: PostAttachmentPreview, index: number) => {
                if (failedIndexes.has(index)) {
                    return renderFallback(index);
                }

                switch (true) {
                    case attachment.mimeType.startsWith('image'):
                        return (
                            <div
                                key={index}
                                className={`relative w-full h-[400px] overflow-hidden ${index !== currentAttachmentIndex && 'hidden'}`}
                            >
                                {/* Blurred Background */}
                                <Image
                                src={attachment.src}
                                alt="blurred bg"
                                fill
                                className="object-cover blur-xl scale-110"
                                onError={() => handleFail(index)}
                                />

                                {/* Main Image */}
                                <Image
                                src={attachment.src}
                                alt="main"
                                fill
                                className="object-contain"
                                onError={() => handleFail(index)}
                                />
                            </div>
                        );

                    case attachment.mimeType.startsWith('video'):
                        return (
                            <div
                                key={index}
                                className={`relative w-full h-[400px] ${index !== currentAttachmentIndex && 'hidden'}`}
                            >
                                <video
                                controls
                                src={attachment.src}
                                className="w-full h-full"
                                onError={() => handleFail(index)}
                                />
                            </div>
                        );

                    default:
                        return null;
                }
            })}
            <Tooltip text='Back' relative={false} className='absolute start-0 top-1/2 -translate-y-1/2 ms-2'>
                <button disabled={isAtFirstAttachment} onClick={handleBack} type='button' className='flex items-center justify-center rounded-full bg-dark-btn text-white p-1 hover:opacity-50 transition-all'>
                    <IconChevronLeft/>
                </button>
            </Tooltip>
            <Tooltip text='Next' relative={false} className='absolute end-0 top-1/2 -translate-y-1/2 me-2'>
                <button disabled={isAtLastAttachment} onClick={handleNext} type='button' className='flex items-center justify-center rounded-full bg-dark-btn text-white p-1 hover:opacity-50 transition-all'>
                    <IconChevronRight/>
                </button>
            </Tooltip>
            {onDelete && (
                <Tooltip text='Delete' relative={false} className='absolute end-0 me-2' style={{top: '55px'}}>
                    <button onClick={() => onDelete(currentAttachmentIndex)} type='button' className='flex items-center justify-center rounded-full bg-red-600 text-white p-1 hover:opacity-50 transition-all'>
                        <IconTrash/>
                    </button>
                </Tooltip>
            )}
            <button type='button' className='flex items-center justify-center absolute end-0 top-0 mt-2 me-2 rounded-full bg-dark-btn text-white p-2 text-sm'>
                {currentAttachmentIndex + 1} / {attachments.length}
            </button>
        </div>
    )
}

export default PostAttachments