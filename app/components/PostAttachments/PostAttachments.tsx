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

const PostAttachments = ({ attachments, onDelete }: Props) => {
    const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(-1);
    const isAtFirstAttachment = currentAttachmentIndex === 0;
    const isAtLastAttachment = currentAttachmentIndex === attachments.length - 1;
    const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (currentAttachmentIndex === -1 && attachments.length > 0) {
            setCurrentAttachmentIndex(0);
        } else if (currentAttachmentIndex + 1 > attachments.length) {
            setCurrentAttachmentIndex(attachments.length - 1);
        }
    }, [attachments.length, currentAttachmentIndex]);

    const handleFail = (index: number) => {
        setFailedIndexes(prev => new Set(prev).add(index));
    };

    const handleNext = () => {
        setCurrentAttachmentIndex(Math.min(currentAttachmentIndex + 1, attachments.length - 1));
    };

    const handleBack = () => {
        setCurrentAttachmentIndex(Math.max(currentAttachmentIndex - 1, 0));
    };

    const total = attachments.length;
    const current = currentAttachmentIndex + 1;

    return (
        <div className="relative w-full h-[420px] overflow-hidden rounded-2xl bg-bgSecondary ring-1 ring-borderPrimary group">

            {/* Slides */}
            {attachments.map((attachment, index) => {
                const isActive = index === currentAttachmentIndex;
                const direction = index < currentAttachmentIndex ? '-translate-x-full' : 'translate-x-full';
                const positionClass = isActive ? 'translate-x-0' : `${direction} pointer-events-none`;

                return (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-transform duration-500 ease-in-out overflow-hidden ${positionClass}`}
                    >
                        {failedIndexes.has(index) ? (
                            <div className="flex flex-col gap-3 items-center justify-center w-full h-full bg-bgSecondary text-textPrimary/30">
                                <div className="p-4 rounded-2xl bg-borderPrimary/40">
                                    <IconAlertCircle size={32} />
                                </div>
                                <p className="text-sm font-medium">Failed to load media</p>
                            </div>
                        ) : attachment.mimeType.startsWith('image') ? (
                            <>
                                {/* Blurred background */}
                                <SmartImage
                                    src={attachment.src}
                                    alt="blurred bg"
                                    className="blur-2xl scale-110 opacity-60"
                                    objectFit="cover"
                                    width="100%"
                                    height="100%"
                                    position="absolute"
                                />
                                {/* Main image */}
                                <SmartImage
                                    src={attachment.src}
                                    alt="main"
                                    objectFit="contain"
                                    width="100%"
                                    height="100%"
                                    position="absolute"
                                />
                            </>
                        ) : attachment.mimeType.startsWith('video') ? (
                            <video
                                controls
                                src={attachment.src}
                                className="w-full h-full object-contain"
                                onError={() => handleFail(index)}
                            />
                        ) : null}
                    </div>
                );
            })}

            {/* Top bar: counter + delete */}
            <div className="
                absolute top-0 left-0 right-0
                flex items-center justify-between
                px-4 pt-4
                pointer-events-none
            ">
                {/* Pill counter */}
                <div className="
                    pointer-events-auto
                    flex items-center gap-1.5
                    px-3 py-1.5 rounded-full
                    bg-black/40 backdrop-blur-md
                    text-white text-xs font-semibold tabular-nums
                    ring-1 ring-white/10
                ">
                    <span className="text-white">{current}</span>
                    <span className="text-white/40">/</span>
                    <span className="text-white/60">{total}</span>
                </div>

                {/* Dot indicators */}
                {total > 1 && (
                    <div className="pointer-events-auto flex items-center gap-1.5">
                        {attachments.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentAttachmentIndex(i)}
                                className={`
                                    rounded-full transition-all duration-300
                                    ${i === currentAttachmentIndex
                                        ? 'w-4 h-2 bg-white'
                                        : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                                    }
                                `}
                            />
                        ))}
                    </div>
                )}

                {/* Delete button */}
                {onDelete && (
                    <div className="pointer-events-auto">
                        <DynamicTooltip text="Delete">
                            <button
                                onClick={() => onDelete(currentAttachmentIndex)}
                                type="button"
                                className="
                                    flex items-center justify-center
                                    w-8 h-8 rounded-full
                                    bg-red-500/80 hover:bg-red-500
                                    backdrop-blur-md
                                    text-white
                                    transition-all duration-200
                                    hover:scale-105
                                "
                            >
                                <IconTrash size={15} />
                            </button>
                        </DynamicTooltip>
                    </div>
                )}
            </div>

            {/* Left nav */}
            {!isAtFirstAttachment && total > 1 && (
                <div className="
                    absolute left-0 top-1/2 -translate-y-1/2 ml-3
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                ">
                    <DynamicTooltip text="Previous">
                        <button
                            onClick={handleBack}
                            type="button"
                            className="
                                flex items-center justify-center
                                w-9 h-9 rounded-full
                                bg-black/40 hover:bg-black/60
                                backdrop-blur-md
                                text-white
                                ring-1 ring-white/10
                                transition-all duration-200
                                hover:scale-105
                            "
                        >
                            <IconChevronLeft size={20} />
                        </button>
                    </DynamicTooltip>
                </div>
            )}

            {/* Right nav */}
            {!isAtLastAttachment && total > 1 && (
                <div className="
                    absolute right-0 top-1/2 -translate-y-1/2 mr-3
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                ">
                    <DynamicTooltip text="Next">
                        <button
                            onClick={handleNext}
                            type="button"
                            className="
                                flex items-center justify-center
                                w-9 h-9 rounded-full
                                bg-black/40 hover:bg-black/60
                                backdrop-blur-md
                                text-white
                                transition-all duration-200
                                hover:scale-105
                            "
                        >
                            <IconChevronRight size={20} />
                        </button>
                    </DynamicTooltip>
                </div>
            )}

            {/* Bottom gradient fade for polish */}
            <div className="
                absolute bottom-0 left-0 right-0 h-16
                bg-gradient-to-t from-black/20 to-transparent
                pointer-events-none
            " />
        </div>
    );
};

export default PostAttachments;