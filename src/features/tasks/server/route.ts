import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, DEPARTMENTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { CoTypes, Task, TaskStatus } from "../types";
import { Department } from "@/features/departments/types";

const app = new Hono()
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({ data: { $id: task.$id } });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        departmentId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
        coType: z.nativeEnum(CoTypes).nullish(),
        coName: z.string().nullish(),
        receivedThrough: z.string().nullish(),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const {
        workspaceId,
        departmentId,
        status,
        search,
        dueDate,
        coType,
        coName,
        receivedThrough,
      } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (departmentId) {
        console.log("departmentId", departmentId);
        query.push(Query.equal("departmentId", departmentId));
      }

      if (status) {
        console.log("status", status);
        query.push(Query.equal("status", status));
      }

      if (dueDate) {
        console.log("dueDate", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log("search", search);
        query.push(Query.search("name", search));
      }

      if (coType) {
        console.log("coType", coType);
        query.push(Query.equal("coType", coType));
      }

      if (coName) {
        console.log("coName", coName);
        query.push(Query.search("coName", coName));
      }

      if (receivedThrough) {
        console.log("receivedThrough", receivedThrough);
        query.push(Query.search("receivedThrough", receivedThrough));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const departmentIds = tasks.documents.map((task) => task.departmentId);

      const departments = await databases.listDocuments<Department>(
        DATABASE_ID,
        DEPARTMENTS_ID,
        departmentIds.length > 0 ? [Query.contains("$id", departmentIds)] : []
      );

      const populatedTasks = tasks.documents.map((task) => {
        const department = departments.documents.find(
          (department) => department.$id === task.departmentId
        );

        return {
          ...task,
          department,
        };
      });

      return c.json({
        data: {
          tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        name,
        status,
        workspaceId,
        departmentId,
        dueDate,
        designation,
        coType,
        coName,
        receivedThrough,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId: workspaceId as string,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId as string),
          Query.orderDesc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const highestSerialNo = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId as string),
          Query.orderDesc("serialNo"),
          Query.limit(1),
        ]
      );

      const newSerialNo =
        highestSerialNo.documents.length > 0
          ? highestSerialNo.documents[0].serialNo + 1
          : 1;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          departmentId,
          dueDate,
          position: newPosition,
          designation,
          coType,
          coName,
          receivedThrough,
          serialNo: newSerialNo,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        name,
        status,
        description,
        departmentId,
        dueDate,
        designation,
        coType,
        coName,
        receivedThrough,
      } = c.req.valid("json");
      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          departmentId,
          dueDate,
          description,
          designation,
          coType,
          coName,
          receivedThrough,
        }
      );

      return c.json({ data: task });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const department = await databases.getDocument<Department>(
      DATABASE_ID,
      DEPARTMENTS_ID,
      task.departmentId
    );

    return c.json({
      data: {
        ...task,
        department,
      },
    });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { tasks } = await c.req.valid("json");

      const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      const workspaceIds = new Set(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json({ error: "All tasks must belong to the same workspace" });
      }

      const workspaceId = workspaceIds.values().next().value;

      const member = await getMember({
        databases,
        workspaceId: workspaceId as string,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;
          return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
            status,
            position,
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  );

export default app;
