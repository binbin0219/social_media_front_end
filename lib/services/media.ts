import { apiAgent } from "../api-agent";
import { Media } from "../models/Media";

const createMedia = async (file: File): Promise<Media> => {
    const formData = new FormData();
    formData.set("file", file);

    const response = await apiAgent.fetchOnClient("/api/media/", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload media");
    }

    return await response.json();
};

export const mediaService = {
    createMedia,
};
