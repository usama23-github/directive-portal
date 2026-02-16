"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTaskSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTask } from "../api/use-create-task";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoTypes, TaskStatus } from "../types";
import { DepartmentAvatar } from "@/features/departments/components/department-avatar";

interface CreateTaskFormProps {
  onCancel?: () => void;
  departmentOptions: { id: string; name: string; imageUrl: string }[];
}

export const CreateTaskForm = ({
  onCancel,
  departmentOptions,
}: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new directive
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Directive</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter directive" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter designation" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>C/O</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select c/o" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={CoTypes.MPA}>MPA</SelectItem>
                        <SelectItem value={CoTypes.MNA}>MNA</SelectItem>
                        <SelectItem value={CoTypes.MINISTER}>
                          MINISTER
                        </SelectItem>
                        <SelectItem value={CoTypes.SENATOR}>SENATOR</SelectItem>
                        <SelectItem value={CoTypes.SACM}>SACM</SelectItem>
                        <SelectItem value={CoTypes.ADVISOR}>ADVISOR</SelectItem>
                        <SelectItem value={CoTypes.PPPLEADER}>
                          PPP LEADER
                        </SelectItem>
                        <SelectItem value={CoTypes.OTHER}>OTHER</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>C/O Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter c/o name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  console.log("Hello");
                  return (
                    <FormItem>
                      <FormLabel>Received on</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value
                              ? field.value instanceof Date
                                ? field.value
                                : new Date(field.value)
                              : undefined
                          }
                          onChange={(date) => {
                            form.setValue("dueDate", date, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="receivedThrough"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received through</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter received through" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.UNDER_REVIEW}>
                          Under Review
                        </SelectItem>
                        <SelectItem value={TaskStatus.NOTIFIED}>
                          Notified
                        </SelectItem>
                        <SelectItem value={TaskStatus.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {departmentOptions.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            <div className="flex items-center gap-x-2">
                              <DepartmentAvatar
                                className="size-6"
                                name={department.name}
                                image={department.imageUrl}
                              />
                              {department.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit" size="lg">
                Create Directive
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
