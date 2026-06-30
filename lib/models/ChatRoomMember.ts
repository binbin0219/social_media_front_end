import { Story } from "./Story";

export type ChatRoomMember = {
    id: string;
    userId: number;
    username: string;
    stories: Story[];
    userUpdatedAt?: string;
}