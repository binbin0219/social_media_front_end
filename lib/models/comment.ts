import { User } from "./user"

export type PostComment = {
    id: number,
    content: string,
    user: User,
    createAt: string
}