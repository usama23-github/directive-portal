"use client";

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetDepartment } from "@/features/departments/api/use-get-department";
import { useGetDepartmentAnalytics } from "@/features/departments/api/use-get-department-analytics";
import { DepartmentAvatar } from "@/features/departments/components/department-avatar";
import { useDepartmentId } from "@/features/departments/hooks/use-department-id";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export const ProjectIdClient = () => {
  const departmentId = useDepartmentId();
  const { data: department, isLoading: isLoadingDepartment } = useGetDepartment(
    { departmentId }
  );
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetDepartmentAnalytics({ departmentId });

  const isLoading = isLoadingDepartment || isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!department) {
    return <PageError message="Department not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <DepartmentAvatar
            name={department.name}
            image={department.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{department.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${department.workspaceId}/departments/${department.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit department
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}

      <TaskViewSwitcher hideDepartmentFilter />
    </div>
  );
};
