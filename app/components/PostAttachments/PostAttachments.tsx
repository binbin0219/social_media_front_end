import React, { useEffect, useState } from 'react'
import DynamicTooltip from '../Tooltip/DynamicToolTip';
import { IconAlertCircle, IconChevronLeft, IconChevronRight, IconTrash } from '@tabler/icons-react';
import SmartImage from '../SmartImage';

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

    const handleNext = () => {
        setCurrentAttachmentIndex(Math.min(currentAttachmentIndex + 1, attachments.length - 1));
    }

    const handleBack = () => {
        setCurrentAttachmentIndex(Math.max(currentAttachmentIndex - 1, 0));
    }

    return (
        <div className="relative w-full h-[400px] overflow-hidden rounded-md">
            {attachments.map((attachment: PostAttachmentPreview, index: number) => {
                const isActive = index === currentAttachmentIndex;
                const direction = index < currentAttachmentIndex ? '-translate-x-full' : 'translate-x-full';

                const baseClasses = `absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out overflow-hidden`;
                const activeClass = isActive ? 'translate-x-0' : `${direction} pointer-events-none`;

                return (
                    <div key={index} className={`${baseClasses} ${activeClass}`}>
                        {failedIndexes.has(index) ? (
                            <div className="flex flex-col gap-2 items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                                <IconAlertCircle size={40} />
                                <p>Failed to load media</p>
                            </div>
                        ) : attachment.mimeType.startsWith('image') ? (
                            <>
                                <SmartImage
                                src={attachment.src}
                                alt="blurred bg"
                                className="blur-xl scale-110"
                                objectFit='cover'
                                width={'100%'}
                                height={'100%'}
                                position='absolute'
                                />
                                <SmartImage
                                src={attachment.src}
                                alt="main"
                                objectFit='contain'
                                width={'100%'}
                                height={'100%'}
                                position='absolute'
                                />
                            </>
                        ) : attachment.mimeType.startsWith('video') ? (
                            <video
                                controls
                                src={attachment.src}
                                className="w-full h-full"
                                onError={() => handleFail(index)}
                            />
                        ) : null}
                    </div>
                );
            })}
            <DynamicTooltip text='Back' className={`absolute start-0 top-1/2 -translate-y-1/2 ms-2 ${(currentAttachmentIndex === 0 || attachments.length === 0) && 'hidden'}`}>
                <button disabled={isAtFirstAttachment} onClick={handleBack} type='button' className='flex items-center justify-center rounded-full bg-dark-btn text-white p-1 hover:opacity-50 transition-all'>
                    <IconChevronLeft/>
                </button>
            </DynamicTooltip>
            <DynamicTooltip text='Next' className={`absolute end-0 top-1/2 -translate-y-1/2 me-2 ${(currentAttachmentIndex === attachments.length - 1 || attachments.length === 0) && 'hidden'}`}>
                <button disabled={isAtLastAttachment} onClick={handleNext} type='button' className='flex items-center justify-center rounded-full bg-dark-btn text-white p-1 hover:opacity-50 transition-all'>
                    <IconChevronRight/>
                </button>
            </DynamicTooltip>
            {onDelete && (
                <DynamicTooltip text='Delete' className='absolute end-0 me-2' style={{top: '55px'}}>
                    <button onClick={() => onDelete(currentAttachmentIndex)} type='button' className='flex items-center justify-center rounded-full bg-red-600 text-white p-1 hover:opacity-50 transition-all'>
                        <IconTrash/>
                    </button>
                </DynamicTooltip>
            )}
            <button type='button' className='flex items-center justify-center absolute end-0 top-0 mt-2 me-2 rounded-full bg-dark-btn text-white p-2 text-sm'>
                {currentAttachmentIndex + 1} / {attachments.length}
            </button>
        </div>
    )
}

export default PostAttachments