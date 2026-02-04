import { Card, CardContent } from "@/components/ui/card";
import { useGetDepartments } from "@/features/departments/api/use-get-departments";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useGetTask } from "../api/use-get-task";
import { EditTaskForm } from "./edit-task-form";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const { data: departments, isLoading: isLoadingDepartments } =
    useGetDepartments({ workspaceId });

  const departmentOptions = departments?.documents.map((department) => ({
    id: department.$id,
    name: department.name,
    imageUrl: department.imageUrl,
  }));

  const isLoading = isLoadingDepartments || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditTaskForm
      onCancel={onCancel}
      initialValues={initialValues}
      departmentOptions={departmentOptions ?? []}
    />
  );
};
