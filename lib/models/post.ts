import { PostComment } from "./comment";
import { User } from "./user";

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