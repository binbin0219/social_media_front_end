import type { Post, PostAttachments as PostAttachmentsType } from '@/lib/models/post'
import { useState } from "react";
import PostHeader from './PostHeader';
import { Eye, EyeOff } from 'lucide-react';
import PostContent from './PostContent';
import PostAttachments from '../PostAttachments/PostAttachments';

type Props = {
    sharedPost: Post;
    onPostClick?: (post: Post) => void;
}

export default function SharedPostPreview({ sharedPost, onPostClick }: Props) {
    const [sensitiveRevealed, setSensitiveRevealed] = useState(false);
    const showSensitiveOverlay = sharedPost.isSensitive && !sensitiveRevealed;

    const attachments = sharedPost.attachments
        ?.filter((a: PostAttachmentsType) => a.media)
        .map((a: PostAttachmentsType) => ({
            src: a.media!.url,
            mimeType: a.media!.mimeType,
        })) ?? [];

    return (
        <div
            className={`
                rounded-xl border border-borderPrimary bg-bgPrimary overflow-hidden
                ${onPostClick ? 'cursor-pointer hover:border-borderSecondary transition-colors duration-150' : ''}
            `}
            onClick={onPostClick ? (e) =>(e.stopPropagation(), onPostClick(sharedPost)) : undefined}
        >
            {/* Body */}
            <div className="p-3">
                <PostHeader post={sharedPost} size="sm" className="mb-2" />

                <div onClick={(e) => e.stopPropagation()}>
                    {showSensitiveOverlay ? (
                        <div className="
                            flex flex-col items-center justify-center gap-2
                            rounded-lg border border-amber-200 dark:border-amber-500/20
                            bg-amber-50 dark:bg-amber-500/10
                            py-5 text-center
                        ">
                            <EyeOff size={18} className="text-amber-500" />
                            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                                Sensitive content
                            </p>
                            <button
                                onClick={e => {
                                    e.stopPropagation(); // don't open dialog when revealing
                                    setSensitiveRevealed(true);
                                }}
                                className="
                                    flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg
                                    bg-amber-100 hover:bg-amber-200
                                    dark:bg-amber-500/20 dark:hover:bg-amber-500/30
                                    text-amber-700 dark:text-amber-400 transition-colors
                                "
                            >
                                <Eye size={12} /> Show anyway
                            </button>
                        </div>
                    ) : (
                        <>
                            {sharedPost.isSensitive && (
                                <span className="
                                    inline-flex items-center gap-1 text-[10px] font-medium mb-1.5
                                    px-1.5 py-px rounded-full
                                    bg-amber-50 dark:bg-amber-500/10
                                    text-amber-600 dark:text-amber-400
                                    border border-amber-200 dark:border-amber-500/20
                                ">
                                    <EyeOff size={9} /> Sensitive
                                </span>
                            )}

                            {sharedPost.content && (
                                <PostContent content={sharedPost.content} />
                            )}

                            {attachments.length > 0 && (
                                <div className="mt-2">
                                    <PostAttachments attachments={attachments} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Footer stats */}
            <div className="flex items-center gap-3 px-3 py-2 border-t border-borderPrimary" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-textSecondary">
                    {sharedPost.likeCount ?? 0} likes
                </span>
                <span className="text-xs text-textSecondary">
                    {sharedPost.commentCount ?? 0} comments
                </span>
            </div>
        </div>
    );
}
