import { prisma } from "@/lib/prisma";
import fs from "fs";
import { userAvatarDirPath } from "../constants";
import { generateRandomAvatarSVG } from "../avataaars";
import { convertSvgToPngBuffer } from "../main";
import { Friendship } from "./friendship";

export type User = {
    id: number;
    gender: string | null;
    username: string;
    firstName: string;
    lastName: string;
    occupation: string | null;
    country: string | null;
    region: string | null;
    phoneNumber: PhoneNumber;
    relationshipStatus: string | null;
    create_at: String;
    avatar?: string | null;
    coverUrl?: string;
    friendship?: Friendship;
    newNotificationCount? : number;
    seenNotificationCount? : number;
    unreadChatMessageCount: number;
} | null

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

export async function checkIfAccountNameExisted(accountName: string) {
    const isAccountNameExisted = await prisma.user.findMany({
        where: {
            account_name: accountName
        }
    })
    return isAccountNameExisted.length > 0 ? true : false;
}

export async function createUserAvatar(userId: number, gender: string) : Promise<string> {
    makeSureUserAvatarDirExists();
    const avatarSVG = await generateRandomAvatarSVG(gender);
    const avatarPngBuffer = await convertSvgToPngBuffer(avatarSVG);
    fs.writeFileSync(`${userAvatarDirPath}/user_avatar_${userId}.png`, avatarPngBuffer);
    return `data:image/png;base64,${avatarPngBuffer.toString('base64')}`;
}

export function getUserAvatarBase64(userId: number) : string {
    try {
        const avatarBuffer = fs.readFileSync(`${userAvatarDirPath}/user_avatar_${userId}.png`);
        const avatarBase64 = avatarBuffer.toString('base64');
        return `data:image/png;base64,${avatarBase64}`;
    } catch (error) {
        return "";
    }
}

export async function getSafeUserDataFromDb(id: number) : Promise<User> {
    return await prisma.user.findUnique({ 
        where: { id },
        select: { 
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
    }) as User;
}

export async function getUserDataById(id: number) : Promise<User> {
    const userDataFromDb = await getSafeUserDataFromDb(id);
    if(!userDataFromDb) return null;
    userDataFromDb.avatar = getUserAvatarBase64(id);
    if(!userDataFromDb.avatar) userDataFromDb.avatar = await createUserAvatar(id, userDataFromDb.gender);
    return userDataFromDb;
}

function makeSureUserAvatarDirExists() {
    if (!fs.existsSync(userAvatarDirPath)) {
        fs.mkdirSync(userAvatarDirPath, { recursive: true });
    }
}