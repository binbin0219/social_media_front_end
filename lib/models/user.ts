import { Friendship } from "./friendship";

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
    avatar?: string | null;
    coverUrl?: string;
    friendship?: Friendship;
    newNotificationCount? : number;
    seenNotificationCount? : number;
    unreadChatMessageCount: number;
    postCount: number | null;
    likeCount: number | null;
    friendCount: number | null;
} | null

export type Gender = "male" | "female"

export type PhoneNumber = {
    countryISO2: string;
    countryName: string;
    dialCode: string;
    fullNumber: string;
    phoneNumberBody: string;
}

export type Friend = Pick<NonNullable<User>, 'id' | 'username' | 'updatedAt'>;

export type RecommendedUsers = Pick<NonNullable<User>, 'id' | 'username' | 'updatedAt'>;