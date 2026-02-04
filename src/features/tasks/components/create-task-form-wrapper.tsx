import { Card, CardContent } from "@/components/ui/card";
import { useGetDepartments } from "@/features/departments/api/use-get-departments";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
  onCancel,
}: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: departments, isLoading: isLoadingDepartments } =
    useGetDepartments({ workspaceId });

  const departmentOptions = departments?.documents.map((department) => ({
    id: department.$id,
    name: department.name,
    imageUrl: department.imageUrl,
  }));

  const isLoading = isLoadingDepartments;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      departmentOptions={departmentOptions ?? []}
    />
  );
};
