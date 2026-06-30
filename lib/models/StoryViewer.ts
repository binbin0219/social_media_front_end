import { Friendship } from "./friendship";
import { Story } from "./Story";

export type StoryViewer = {
  userId: number;
  username: string;
  updatedAt: string;
  stories: Story[];
  friendship: Friendship;
};