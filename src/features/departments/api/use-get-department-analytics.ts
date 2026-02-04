import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface UseGetDepartmentAnalyticsProps {
  departmentId: string;
}

export type DepartmentAnalyticsResponseType = InferResponseType<
  (typeof client.api.departments)[":departmentId"]["analytics"]["$get"],
  200
>;

export const useGetDepartmentAnalytics = ({
  departmentId,
}: UseGetDepartmentAnalyticsProps) => {
  const query = useQuery({
    queryKey: ["department-analytics", departmentId],
    queryFn: async () => {
      const response = await client.api.departments[":departmentId"][
        "analytics"
      ].$get({
        param: { departmentId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch department analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
