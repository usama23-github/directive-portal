import { Models } from "node-appwrite";

export type Department = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};
