"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetDepartment } from "@/features/departments/api/use-get-department";
import { EditDepartmentForm } from "@/features/departments/components/edit-department-form";
import { useDepartmentId } from "@/features/departments/hooks/use-department-id";

export const ProjectIdSettingsClient = () => {
  const departmentId = useDepartmentId();
  const { data: initialValues, isLoading } = useGetDepartment({
    departmentId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    return <PageError message="Department not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditDepartmentForm initialValues={initialValues} />
    </div>
  );
};
