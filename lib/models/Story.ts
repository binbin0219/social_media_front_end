import { Media } from "./Media"
import { User } from "./user"

export type Story = {
  id: number
  user: User
  media: Media
  isViewed: boolean
  viewCount: number
  createdAt: string
  expiresAt: string
}