import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.departments)[":departmentId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.departments)[":departmentId"]["$delete"]
>;

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.departments[":departmentId"]["$delete"](
        {
          param,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete department");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Department deleted");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete department");
    },
  });

  return mutation;
};
