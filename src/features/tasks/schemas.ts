import { z } from "zod";
import { CoTypes, TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().optional(),
  departmentId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  description: z.string().optional(),
  designation: z.string().optional(),
  coType: z.nativeEnum(CoTypes, { required_error: "Required" }),
  coName: z.string().trim().min(1, "Required"),
  receivedThrough: z.string().trim().min(1, "Required"),
});
