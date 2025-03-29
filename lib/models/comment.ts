import { User } from "./user"

export type PostComment = {
    id: Number,
    content: String,
    user: User,
    createAt: String
}