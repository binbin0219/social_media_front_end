import { Friendship } from "./friendship";
import { Media } from "./Media";
import { Story } from "./Story";

export type StoryViewer = {
  userId: number;
  username: string;
  avatar?: Media | null;
  background?: Media | null;
  updatedAt: string;
  stories: Story[];
  friendship: Friendship;
};
