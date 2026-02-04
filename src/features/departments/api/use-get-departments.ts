import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetDepartmentsProps {
  workspaceId: string;
}

export const useGetDepartments = ({ workspaceId }: UseGetDepartmentsProps) => {
  const query = useQuery({
    queryKey: ["departments", workspaceId],
    queryFn: async () => {
      const response = await client.api.departments.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
