import { Models } from "node-appwrite";

export enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  UNDER_REVIEW = "UNDER_REVIEW",
  NOTIFIED = "NOTIFIED",
  OTHER = "OTHER",
}

export enum CoTypes {
  MPA = "MPA",
  MNA = "MNA",
  MINISTER = "MINISTER",
  SENATOR = "SENATOR",
  SACM = "SACM",
  ADVISOR = "ADVISOR",
  PPPLEADER = "PPPLEADER",
  OTHER = "OTHER",
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  workspaceId: string;
  departmentId: string;
  position: number;
  dueDate: string;
  description?: string;
  designation: string;
  coType: CoTypes;
  coName: string;
  receivedThrough: string;
};
