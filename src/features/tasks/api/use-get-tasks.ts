import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { CoTypes, TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  departmentId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  dueDate?: string | null;
  coType?: CoTypes | null;
  coName?: string | null;
  receivedThrough?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  departmentId,
  status,
  search,
  dueDate,
  coType,
  coName,
  receivedThrough,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      departmentId,
      status,
      search,
      dueDate,
      coType,
      coName,
      receivedThrough,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          departmentId: departmentId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined,
          coType: coType ?? undefined,
          coName: coName ?? undefined,
          receivedThrough: receivedThrough ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch directives");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
