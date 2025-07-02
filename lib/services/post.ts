import { apiAgent } from "../api-agent";
import { Post, PostWithUserId } from "../models/post";

const fetchPostsByUserId = async (userId: number, offset: number, recordPerPage: number): Promise<PostWithUserId[]> => {
    const response = await apiAgent.fetchOnClient(`/api/post/get/${userId}?offset=${offset}&recordPerPage=${recordPerPage}`);
    if(!response.ok) {
        throw new Error("Failed to fetch posts by user id");
    }
    const data = await response.json();
    return data;
}

const createPostOnServer = async (formData: FormData): Promise<Post> => {
    const response = await apiAgent.fetchOnClient(`/api/post/create`, { 
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error("Failed to create post on server");
    }
    const createdPost = await response.json();
    return createdPost;
}

export const postService = {
    fetchPostsByUserId,
    createPostOnServer
}