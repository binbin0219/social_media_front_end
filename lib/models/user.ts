import { Friendship } from "./friendship";

export type User = {
    id: number;
    gender: Gender;
    username: string;
    firstName: string;
    lastName: string;
    occupation: string | null;
    country: string | null;
    region: string | null;
    phoneNumber: PhoneNumber;
    relationshipStatus: string | null;
    create_at: string;
    avatar?: string | null;
    coverUrl?: string;
    friendship?: Friendship;
    newNotificationCount? : number;
    seenNotificationCount? : number;
    unreadChatMessageCount: number;
} | null

export type Gender = "male" | "female"

export type PhoneNumber = {
    countryISO2: string;
    countryName: string;
    dialCode: string;
    fullNumber: string;
    phoneNumberBody: string;
}

export type Friend = Pick<NonNullable<User>, 'id' | 'username' | 'avatar'>;

export const safeUserColumnSelections = {
    id: true,
    first_name: true, 
    last_name: true,
    username: true,
    gender: true,
    occupation: true,
    region: true,
    phone_number: true,
    country: true,
    create_at: true,
}