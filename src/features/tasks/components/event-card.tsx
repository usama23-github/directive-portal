import { Department } from "@/features/departments/types";
import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { DepartmentAvatar } from "@/features/departments/components/department-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface EventCardProps {
  title: string;
  receivedThrough: string;
  department: Department;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.UNDER_REVIEW]: "border-l-blue-500",
  [TaskStatus.NOTIFIED]: "border-l-emerald-500",
  [TaskStatus.OTHER]: "border-l-pink-500",
};

export const EventCard = ({
  title,
  receivedThrough,
  department,
  status,
  id,
}: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={receivedThrough} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <DepartmentAvatar
            name={department?.name}
            image={department?.imageUrl}
          />
        </div>
      </div>
    </div>
  );
};
