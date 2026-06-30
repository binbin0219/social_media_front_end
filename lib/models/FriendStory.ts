import { Story } from "./Story"
import { User } from "./user"

export type FriendStory = {
  user: User
  stories: Story[]
}