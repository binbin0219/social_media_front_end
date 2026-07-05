import { FriendDTO } from "@/components/FriendlazyloadList";
import { PostComment } from "./comment";
import { User } from "./user";
import { Friendship } from "./friendship";
import { Media } from "./Media";

export type Post = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    commentCount: number;
    likeCount: number;
    shareCount: number;
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
    sharedPost?: Post;
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
    id: number;
    media?: Media;
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

export type CreatePostRequest = {
    content: string;
    privacySetting: PrivacySetting;
    commentStatus: CommentStatus;
    isSensitive: boolean;
    selectedFriendIds: number[];
    mediaIds: number[];
}

export type AttachmentUrlAndFile = {
    url: string;
    mimeType: string;
    file?: File;
    mediaId?: number;
};
