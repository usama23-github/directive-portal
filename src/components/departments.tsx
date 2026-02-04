"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetDepartments } from "@/features/departments/api/use-get-departments";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import React from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useCreateDepartmentModal } from "@/features/departments/hooks/use-create-department-modal";
import { DepartmentAvatar } from "@/features/departments/components/department-avatar";

const Departments = () => {
  const pathname = usePathname();
  const { open } = useCreateDepartmentModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetDepartments({
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Departments</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.documents.map((department) => {
        const href = `/workspaces/${workspaceId}/departments/${department.$id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={department.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <DepartmentAvatar
                image={department.imageUrl}
                name={department.name}
              />
              <span className="truncate">{department.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Departments;
