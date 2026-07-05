import { apiAgent } from "../api-agent";
import { CreatePostRequest, Post } from "../models/post";

const fetchPostsByUserId = async (userId: number, start: number, length: number): Promise<Post[]> => {
    const response = await apiAgent.fetchOnClient(`/api/post/get/${userId}?start=${start}&length=${length}`);
    if(!response.ok) {
        throw new Error("Failed to fetch posts by user id");
    }
    const data = await response.json();
    return data;
}

const createPostOnServer = async (payload: CreatePostRequest): Promise<Post> => {
    const response = await apiAgent.fetchOnClient(`/api/post/create`, { 
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
