import { useParams } from "next/navigation";

export const useDepartmentId = () => {
  const params = useParams();
  return params.departmentId as string;
};
