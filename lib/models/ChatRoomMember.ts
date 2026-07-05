import { Story } from "./Story";
import { Media } from "./Media";

export type ChatRoomMember = {
    id: string;
    userId: number;
    username: string;
    avatar?: Media | null;
    background?: Media | null;
    stories: Story[];
    userUpdatedAt?: string;
}
