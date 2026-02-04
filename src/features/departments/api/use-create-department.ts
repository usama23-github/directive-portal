import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.departments)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.departments)["$post"]>;

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.departments["$post"]({ form });

      if (!response.ok) {
        throw new Error("Failed to create department");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Department created");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: () => {
      toast.error("Failed to create department");
    },
  });

  return mutation;
};
