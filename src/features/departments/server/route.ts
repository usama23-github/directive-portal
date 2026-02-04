import {
  DATABASE_ID,
  DEPARTMENTS_ID,
  IMAGES_BUCKET_ID,
  TASKS_ID,
} from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createDepartmentSchema, updateDepartmentSchema } from "../schemas";
import { Department } from "../types";
import { MemberRole } from "@/features/members/types";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createDepartmentSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const department = await databases.createDocument(
        DATABASE_ID,
        DEPARTMENTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: department });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const departments = await databases.listDocuments<Department>(
        DATABASE_ID,
        DEPARTMENTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: departments });
    }
  )
  .get("/:departmentId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { departmentId } = c.req.param();

    const department = await databases.getDocument<Department>(
      DATABASE_ID,
      DEPARTMENTS_ID,
      departmentId
    );

    const member = await getMember({
      databases,
      workspaceId: department.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: department });
  })
  .patch(
    "/:departmentId",
    sessionMiddleware,
    zValidator("form", updateDepartmentSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { departmentId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingDepartment = await databases.getDocument<Department>(
        DATABASE_ID,
        DEPARTMENTS_ID,
        departmentId
      );

      const member = await getMember({
        databases,
        workspaceId: existingDepartment.workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const department = await databases.updateDocument(
        DATABASE_ID,
        DEPARTMENTS_ID,
        departmentId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: department });
    }
  )
  .delete("/:departmentId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { departmentId } = c.req.param();

    const existingDepartment = await databases.getDocument<Department>(
      DATABASE_ID,
      DEPARTMENTS_ID,
      departmentId
    );

    const member = await getMember({
      databases,
      workspaceId: existingDepartment.workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // TODO: Delete tasks

    await databases.deleteDocument(DATABASE_ID, DEPARTMENTS_ID, departmentId);

    return c.json({ data: { $id: existingDepartment.$id } });
  })
  .get("/:departmentId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { departmentId } = c.req.param();

    const department = await databases.getDocument<Department>(
      DATABASE_ID,
      DEPARTMENTS_ID,
      departmentId
    );

    const member = await getMember({
      databases,
      workspaceId: department.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("departmentId", departmentId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("departmentId", departmentId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const thisMonthInCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("departmentId", departmentId),
        Query.notEqual("status", TaskStatus.NOTIFIED),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("departmentId", departmentId),
        Query.notEqual("status", TaskStatus.NOTIFIED),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const inCompleteTaskCount = thisMonthInCompleteTasks.total;
    const inCompleteTaskDifference =
      inCompleteTaskCount - lastMonthInCompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("departmentId", departmentId),
        Query.equal("status", TaskStatus.NOTIFIED),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("departmentId", departmentId),
        Query.equal("status", TaskStatus.NOTIFIED),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const completedTaskCount = thisMonthCompletedTasks.total;
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total;

    const overDueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("departmentId", departmentId),
      Query.notEqual("status", TaskStatus.NOTIFIED),
      Query.lessThan("dueDate", lastMonthStart.toISOString()),
    ]);

    const overDueTasksCount = overDueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDifference,
        completedTaskCount,
        completedTaskDifference,
        inCompleteTaskCount,
        inCompleteTaskDifference,
        overDueTasksCount,
      },
    });
  });

export default app;
