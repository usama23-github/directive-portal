import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetDepartmentProps {
  departmentId: string;
}

export const useGetDepartment = ({ departmentId }: UseGetDepartmentProps) => {
  const query = useQuery({
    queryKey: ["department", departmentId],
    queryFn: async () => {
      const response = await client.api.departments[":departmentId"].$get({
        param: { departmentId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch department");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
