import { useGetDepartments } from "@/features/departments/api/use-get-departments";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderIcon, ListChecksIcon } from "lucide-react";
import { CoTypes, TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";

interface DataFiltersProps {
  hideDepartmentFilter?: boolean;
}

export const DataFilters = ({ hideDepartmentFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: departments, isLoading: isLoadingDepartments } =
    useGetDepartments({ workspaceId });

  const isLoading = isLoadingDepartments;

  const departmentOptions = departments?.documents.map((department) => ({
    value: department.$id,
    label: department.name,
  }));

  const [{ status, departmentId, dueDate, coType }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onCoTypeChange = (value: string) => {
    setFilters({ coType: value === "all" ? null : (value as CoTypes) });
  };

  const onDepartmentChange = (value: string) => {
    setFilters({ departmentId: value === "all" ? null : (value as string) });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.UNDER_REVIEW}>Under Review</SelectItem>
          <SelectItem value={TaskStatus.NOTIFIED}>Notified</SelectItem>
          <SelectItem value={TaskStatus.OTHER}>Other</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={coType ?? undefined}
        onValueChange={(value) => onCoTypeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All C/O" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All C/O</SelectItem>
          <SelectSeparator />
          <SelectItem value={CoTypes.MPA}>MPA</SelectItem>
          <SelectItem value={CoTypes.MNA}>MNA</SelectItem>
          <SelectItem value={CoTypes.MINISTER}>Minister</SelectItem>
          <SelectItem value={CoTypes.SENATOR}>Senator</SelectItem>
          <SelectItem value={CoTypes.SACM}>SACM</SelectItem>
          <SelectItem value={CoTypes.ADVISOR}>ADVISOR</SelectItem>
          <SelectItem value={CoTypes.PPPLEADER}>PPP LEADER</SelectItem>
          <SelectItem value={CoTypes.OTHER}>Other</SelectItem>
        </SelectContent>
      </Select>
      {!hideDepartmentFilter && (
        <Select
          defaultValue={departmentId ?? undefined}
          onValueChange={(value) => onDepartmentChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder="All departments" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            <SelectSeparator />
            {departmentOptions?.map((department) => (
              <SelectItem key={department.value} value={department.value}>
                {department.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Received on"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
