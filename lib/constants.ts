import path from "path";

export const userAvatarDirPath = path.join(process.cwd(), "storage", "user", "avatar");
export const userAvatarFormat = "png";

export const defaultUserAvatarPath = path.join(userAvatarDirPath, `user_avatar_0.${userAvatarFormat}`);