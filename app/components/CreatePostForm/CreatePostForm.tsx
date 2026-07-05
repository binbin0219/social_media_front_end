import { addToast } from "@/redux/slices/toastSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicTooltip from "../Tooltip/DynamicToolTip";
import {
    IconMoodSmile,
    IconPhotoPlus,
    IconWorld,
    IconUsers,
    IconLock,
    IconUserCheck,
    IconUserX,
    IconMessageCircle,
    IconMessageOff,
    IconAlertTriangle,
} from "@tabler/icons-react";
import PostAttachments, { PostAttachmentPreview } from "../PostAttachments/PostAttachments";
import LoadingButton from "../LoadingButton/LoadingButton";
import { RootState } from "@/redux/store";
import Selector from "../Selector/Selector";
import UserIcon from "../UserIcon/UserIcon";
import { AttachmentUrlAndFile, CommentStatus, CreateEditPost, Post, PrivacySetting } from "@/lib/models/post";
import { FriendDTO } from "../FriendlazyloadList";
import FriendSelector from "./FriendSelector";

type Props = {
    onSubmit?: (payload: CreateEditPost) => Promise<void>;
    onCancel: () => void;
    enableAttachment?: boolean;
    openAttachmentInputAfterLoad?: boolean;
    initialData?: {
        title?: string;
        content?: string;
        attachments?: AttachmentUrlAndFile[];
        privacySetting?: PrivacySetting;
        commentStatus?: CommentStatus;
        isSensitive?: boolean;
        visibilityList?: FriendDTO[];
    };
    // ── Share mode ──────────────────────────────────────────
    shareMode?: {
        originalPost: Post;
        onShare: (payload: CreateEditPost) => Promise<void>;
    };
};

/* ─── Option Configs ─────────────────────────────────────── */

const PRIVACY_OPTIONS: {
    value: PrivacySetting;
    label: string;
    description: string;
    icon: React.ReactNode;
}[] = [
        { value: "PUBLIC", label: "Public", description: "Anyone can see this post", icon: <IconWorld size={15} /> },
        { value: "FRIENDS", label: "Friends", description: "Only your friends can see this", icon: <IconUsers size={15} /> },
        { value: "PRIVATE", label: "Private", description: "Only you can see this", icon: <IconLock size={15} /> },
        { value: "WCV", label: "Who Can View", description: "Specific people can see this", icon: <IconUserCheck size={15} /> },
        { value: "WCNV", label: "Who Cannot View", description: "Specific people are excluded", icon: <IconUserX size={15} /> },
    ];

const COMMENT_OPTIONS: {
    value: CommentStatus;
    label: string;
    description: string;
    icon: React.ReactNode;
}[] = [
        { value: "OPEN", label: "Open", description: "Anyone can comment", icon: <IconMessageCircle size={15} /> },
        { value: "ONLY_FRIENDS", label: "Friends only", description: "Only your friends can comment", icon: <IconUserCheck size={15} /> },
        { value: "CLOSED", label: "Closed", description: "No one can comment", icon: <IconMessageOff size={15} /> },
    ];

const FRIEND_SELECTOR_SETTINGS: PrivacySetting[] = ["WCV", "WCNV"];

/* ─── Main Component ─────────────────────────────────────── */

const CreatePostForm = ({
    onSubmit,
    onCancel,
    initialData,
    enableAttachment = true,
    openAttachmentInputAfterLoad,
    shareMode,
}: Props) => {
    const dispatch = useDispatch();
    const MAX_CONTENT_SIZE = 2000;

    const [postAttachments, setPostAttachments] = useState<AttachmentUrlAndFile[]>(initialData?.attachments ?? []);
    const [content, setContent] = useState(initialData?.content ?? "");
    const [isContentValid, setIsContentValid] = useState(true);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [isContentFocused, setIsContentFocused] = useState(false);
    const [privacySetting, setPrivacySetting] = useState<PrivacySetting>(initialData?.privacySetting ?? "PUBLIC");
    const [commentStatus, setCommentStatus] = useState<CommentStatus>(initialData?.commentStatus ?? "OPEN");
    const [isSensitive, setIsSensitive] = useState(initialData?.isSensitive ?? false);
    // Friend selector state
    const [selectedFriends, setSelectedFriends] = useState<FriendDTO[]>(initialData?.visibilityList ?? []);
    // Key to reset the FriendLazyLoadList when privacy changes between WCV/WCNV
    const [friendListKey, setFriendListKey] = useState(0);

    const currentUser = useSelector((state: RootState) => state.currentUser);
    const isAttachmentInputClicked = useRef<boolean>(false);
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const attachmentLimit = 10;
    const isShareMode = !!shareMode;
    const attachments: PostAttachmentPreview[] = postAttachments.map((a) => ({
        src: a.url,
        mimeType: a.mimeType,
    }));
    const showFriendSelector = FRIEND_SELECTOR_SETTINGS.includes(privacySetting);

    // Clear selected friends when switching away from WCV/WCNV
    const handlePrivacyChange = (value: PrivacySetting) => {
        if (!FRIEND_SELECTOR_SETTINGS.includes(value)) {
            setSelectedFriends([]);
        }
        // Reset list when switching between WCV <-> WCNV to avoid stale selections
        if (FRIEND_SELECTOR_SETTINGS.includes(value) && value !== privacySetting) {
            setSelectedFriends([]);
            setFriendListKey((k) => k + 1);
        }
        setPrivacySetting(value);
    };

    useEffect(() => {
        if (openAttachmentInputAfterLoad && attachmentInputRef.current && !isAttachmentInputClicked.current) {
            attachmentInputRef.current.click();
            isAttachmentInputClicked.current = true;
        }
    }, [openAttachmentInputAfterLoad]);

    // Replace the submit handler to branch on mode
    const handleSubmit = async () => {
        if (isCreatingPost) return;
        if (content.trim() === "" && !isShareMode) {
            setIsContentValid(false);
            return;
        }
        setIsCreatingPost(true);
        const payload: CreateEditPost = {
            content,
            attachments: postAttachments,
            privacySetting,
            commentStatus,
            isSensitive,
            selectedFriends,
        };
        await (isShareMode ? shareMode!.onShare(payload) : onSubmit?.(payload));
        setIsCreatingPost(false);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value.slice(0, MAX_CONTENT_SIZE));
        if (!isContentValid) setIsContentValid(true);
    };

    const handleAttachmentInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const files = e.currentTarget.files;
        if (!files) return;
        if (files.length + attachments.length > attachmentLimit) {
            dispatch(addToast({ message: "Cannot have more than 10 attachments", type: "error" }));
            return;
        }
        for (const file of Array.from(files)) {
            if (file.size > 5 * 1024 * 1024) {
                dispatch(addToast({ message: "Maximum 5MB for each attachment", type: "error" }));
                return;
            }
        }
        Array.from(files).forEach((file) => {
            setPostAttachments((prev) => [...prev, { url: URL.createObjectURL(file), mimeType: file.type, file }]);
        });
        input.value = "";
    };

    const handleDelete = (index: number) => {
        setPostAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const contentProgress = (content.length / MAX_CONTENT_SIZE) * 100;
    const friendSelectorLabel = privacySetting === "WCV"
        ? { heading: "Who can view", hint: "Only selected friends will be able to see this post.", icon: <IconUserCheck size={14} /> }
        : { heading: "Who cannot view", hint: "Selected friends will be excluded from seeing this post.", icon: <IconUserX size={14} /> };

    return (
        <div className="w-[800px] flex flex-col gap-4 mt-3" style={{ maxWidth: "100%" }}>

            {/* ── User Identity ── */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-green-400 rounded-full me-[3px] z-10" />
                    <UserIcon userId={currentUser!.id} avatarUrl={currentUser?.avatar?.url} />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-textPrimary">{currentUser?.username}</span>
                    <span className="text-xs text-textPrimary/40">@{currentUser?.username}</span>
                </div>
            </div>

            {/* ── Original post preview (share mode only) ── */}
            {isShareMode && (
                <div className="rounded-xl border border-borderPrimary bg-bgSecondary px-4 py-3 space-y-1">
                    <p className="text-xs font-semibold text-textPrimary/50 uppercase tracking-wider">
                        Sharing
                    </p>
                    <p className="text-sm font-medium text-textPrimary">
                        {shareMode!.originalPost.user?.firstName} {shareMode!.originalPost.user?.lastName}
                    </p>
                    <p className="text-sm text-textSecondary line-clamp-3">
                        {shareMode!.originalPost.content}
                    </p>
                    {shareMode!.originalPost.attachments?.length > 0 && (
                        <p className="text-xs text-textPrimary/40 pt-1">
                            {shareMode!.originalPost.attachments.length} attachment{shareMode!.originalPost.attachments.length > 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            )}

            {/* ── Content ── */}
            <div className={`
                rounded-xl overflow-hidden bg-bgSecondary transition-all duration-300
                ${isContentFocused
                    ? "ring-2 ring-appPrimary shadow-lg shadow-appPrimary/10"
                    : !isContentValid ? "ring-2 ring-red-400"
                        : "ring-1 ring-borderPrimary"
                }
            `}>
                <textarea
                    className="w-full px-5 pt-5 pb-3 bg-transparent outline-none resize-none text-textPrimary leading-relaxed placeholder:text-textPrimary/30"
                    value={content}
                    onChange={handleContentChange}
                    onFocus={() => setIsContentFocused(true)}
                    onBlur={() => setIsContentFocused(false)}
                    name="content"
                    rows={6}
                    placeholder="Share your thoughts, ideas, or questions…"
                />

                <div className="flex items-center justify-between px-4 py-3 border-t border-borderPrimary/60">
                    <div className="flex items-center gap-1">
                        <DynamicTooltip className="hidden" text="Emoji">
                            <button type="button" className="p-2 rounded-lg text-textPrimary/40 hover:text-appPrimary hover:bg-appPrimary/8 transition-all duration-200">
                                <IconMoodSmile size={20} />
                            </button>
                        </DynamicTooltip>

                        {enableAttachment && !isShareMode && (
                            <DynamicTooltip text="Images/Videos">
                                <label htmlFor="postImg" className="p-2 rounded-lg cursor-pointer text-textPrimary/40 hover:text-appPrimary hover:bg-appPrimary/8 transition-all duration-200 flex items-center">
                                    <IconPhotoPlus size={20} />
                                </label>
                                <input ref={attachmentInputRef} multiple onInput={handleAttachmentInput} id="postImg" type="file" accept="image/*, video/mp4" className="hidden" />
                            </DynamicTooltip>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-90">
                            <circle cx="11" cy="11" r="8" fill="none" stroke="var(--border-primary)" strokeWidth="2.5" />
                            <circle
                                cx="11" cy="11" r="8" fill="none"
                                stroke={contentProgress > 90 ? "#EF4444" : "var(--app-color-primary)"}
                                strokeWidth="2.5" strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 8}`}
                                strokeDashoffset={`${2 * Math.PI * 8 * (1 - contentProgress / 100)}`}
                                style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.3s ease" }}
                            />
                        </svg>
                        <span className={`text-xs font-medium tabular-nums ${contentProgress > 90 ? "text-red-400" : "text-textPrimary/40"}`}>
                            {MAX_CONTENT_SIZE - content.length}
                        </span>
                    </div>
                </div>
            </div>

            {!isContentValid && (
                <p className="text-xs text-red-400 -mt-2 ml-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                    Content is required
                </p>
            )}

            {/* ── Post Settings ── */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 bg-bgSecondary rounded-xl ring-1 ring-borderPrimary">
                <span className="text-[11px] font-semibold text-textPrimary/30 uppercase tracking-widest">
                    Settings
                </span>

                <div className="h-4 w-px bg-borderPrimary" />

                {/* Visibility */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-textPrimary/40 font-medium whitespace-nowrap">Visibility</span>
                    <Selector options={PRIVACY_OPTIONS} value={privacySetting} onChange={handlePrivacyChange} />
                </div>

                <div className="h-4 w-px bg-borderPrimary" />

                {/* Comments */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-textPrimary/40 font-medium whitespace-nowrap">Comments</span>
                    <Selector options={COMMENT_OPTIONS} value={commentStatus} onChange={setCommentStatus} />
                </div>

                <div className="h-4 w-px bg-borderPrimary" />

                {/* Sensitive toggle */}
                <button
                    type="button"
                    onClick={() => setIsSensitive((p) => !p)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg
                        border transition-all duration-200 text-xs font-medium
                        ${isSensitive
                            ? "bg-orange-500/10 border-orange-400/40 text-orange-400"
                            : "bg-bgPrimary border-borderPrimary text-textPrimary/50 hover:border-orange-400/40 hover:text-orange-400/80"
                        }
                    `}
                >
                    <IconAlertTriangle size={14} />
                    <span>Sensitive</span>
                    <div className={`relative w-7 h-4 rounded-full transition-colors duration-200 ml-0.5 ${isSensitive ? "bg-orange-400" : "bg-borderPrimary"}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${isSensitive ? "translate-x-3.5" : "translate-x-0.5"}`} />
                    </div>
                </button>
            </div>

            {/* Sensitive warning */}
            {isSensitive && (
                <div className="flex items-start gap-3 px-4 py-3 bg-orange-500/5 rounded-xl border border-orange-400/20">
                    <IconAlertTriangle size={15} className="text-orange-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-orange-400/80 leading-relaxed">
                        This post will be marked as sensitive. Viewers will see a content warning before viewing it.
                    </p>
                </div>
            )}

            {/* ── Friend Selector (WCV / WCNV) ── */}
            {showFriendSelector && (
                <FriendSelector 
                    icon={friendSelectorLabel.icon}
                    header={friendSelectorLabel.heading}
                    hint={friendSelectorLabel.hint}
                    selectedFriends={selectedFriends}
                    setSelectedFriends={setSelectedFriends}
                    friendListKey={friendListKey}/>
            )}

            {/* ── Attachments (hidden in share mode) ── */}
            {!isShareMode && postAttachments.length > 0 && (
                <>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-textPrimary/50 uppercase tracking-wider">Attachments</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-appPrimary/10 text-appPrimary">
                            {postAttachments.length}/{attachmentLimit}
                        </span>
                    </div>
                    <PostAttachments attachments={attachments} onDelete={handleDelete} />
                </>
            )}

            {/* ── Footer ── */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={onCancel} className="secondary-app-btn">
                    Cancel
                </button>
                <LoadingButton
                    isLoading={isCreatingPost}
                    loaderColor="white"
                    onClick={handleSubmit}
                    className="primary-app-btn"
                    text={isShareMode ? 'Share' : 'Publish'}
                    loadingText={isShareMode ? 'Sharing…' : 'Publishing…'}
                />
            </div>
        </div>
    );
};

export default CreatePostForm;
