"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateDepartmentForm } from "./create-department-form";
import { useCreateDepartmentModal } from "../hooks/use-create-department-modal";

export const CreateDepartmentModal = () => {
  const { isOpen, setIsOpen, close } = useCreateDepartmentModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateDepartmentForm onCancel={close} />
    </ResponsiveModal>
  );
};
