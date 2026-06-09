import { FriendDTO } from "@/components/FriendlazyloadList";
import { PostComment } from "./comment";
import { User } from "./user";
import { Friendship } from "./friendship";

export type Post = {
    id: number;
    title: string;
    content: string;
    create_at: string;
    commentCount: number;
    likeCount: number;
    comments: Array<PostComment>;
    attachments: PostAttachments[];
    isNew?: boolean;
    liked: boolean;
    user: User;
    privacySetting: PrivacySetting;
    commentStatus: CommentStatus;
    isSensitive: boolean;
    canComment: boolean;
    friendship: Friendship;
}

export type PostWithUserId = {
    id: number;
    title: string;
    content: string;
    create_at: string;
    commentCount: number;
    likeCount: number;
    comments: Array<PostComment>;
    attachments: PostAttachments[];
    isNew?: boolean;
    liked: boolean;
    userId: number;
}

export type CreatePostData = {
    title: string;
    content: string;
    attachments: Array<{
        url: string, 
        file: File
    }>
}

export type PostAttachments = {
    id: string,
    presignedUrl?: string;
    format: string;
    mimeType: string;
}

export type PrivacySetting = "PUBLIC" | "FRIENDS" | "PRIVATE" | "WCV" | "WCNV";
export type CommentStatus = "OPEN" | "CLOSED" | "ONLY_FRIENDS";

export type CreateEditPost = {
    content: string,
    attachments: AttachmentUrlAndFile[],
    privacySetting: PrivacySetting,
    commentStatus: CommentStatus,
    isSensitive: boolean,
    selectedFriends: FriendDTO[],
}

export type AttachmentUrlAndFile = {
    url: string;
    file: File;
};