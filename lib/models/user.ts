import { Friendship } from "./friendship";
import { Media } from "./Media";
import { Story } from "./Story";

export type User = {
    id: number;
    gender: Gender;
    username: string;
    firstName: string;
    lastName: string;
    description: string | null;
    occupation: string | null;
    country: string | null;
    region: string | null;
    phoneNumber: PhoneNumber;
    relationshipStatus: string | null;
    create_at: string;
    updatedAt?: string;
    avatar?: Media | null;
    background?: Media | null;
    coverUrl?: string;
    friendship?: Friendship;
    newNotificationCount? : number;
    seenNotificationCount? : number;
    unreadChatMessageCount: number;
    postCount: number | null;
    likeCount: number | null;
    friendCount: number | null;
    stories: Story[];
}

export type Gender = "male" | "female"

export type PhoneNumber = {
    countryISO2: string;
    countryName: string;
    dialCode: string;
    fullNumber: string;
    phoneNumberBody: string;
}

export type Friend = Pick<NonNullable<User>, 'id' | 'username' | 'stories' | 'updatedAt' | 'avatar' | 'background'>;

export type RecommendedUsers = Pick<NonNullable<User>, 'id' | 'username' | 'updatedAt' | 'avatar' | 'background'>;

export type StoryUser = Pick<NonNullable<User>, 'id' | 'username' | 'stories' | 'updatedAt' | 'avatar' | 'background'>;
