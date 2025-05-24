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
    isNew?: boolean;
    liked: boolean;
    userId: number;
}