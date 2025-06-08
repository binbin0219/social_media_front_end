import { apiAgent } from "../api-agent";
import { PostWithUserId } from "../models/post";

const fetchPostsByUserId = async (userId: number, offset: number, recordPerPage: number): Promise<PostWithUserId[]> => {
    const response = await apiAgent.fetchOnClient(`/api/post/get/${userId}?offset=${offset}&recordPerPage=${recordPerPage}`);
    if(!response.ok) {
        throw new Error("Failed to fetch posts by user id");
    }
    const data = await response.json();
    return data;
}

export const postService = {
    fetchPostsByUserId
}