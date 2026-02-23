"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTodoStore } from "@/store/todo-store";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  description: z.string().max(1000).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  tags: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export const TodoForm = (): JSX.Element => {
  const { createTodo } = useTodoStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "medium" }
  });

  const onSubmit = async (values: FormValues): Promise<void> => {
    try {
      await createTodo({
        title: values.title,
        description: values.description,
        dueDate: values.dueDate,
        priority: values.priority,
        tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : []
      });
      reset();
      toast.success("Todo added");
    } catch {
      toast.error("Could not add todo");
    }
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)} aria-label="Create todo form">
      <div>
        <Input placeholder="What needs to be done?" {...register("title")} aria-label="Todo title" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>
      <Textarea placeholder="Description" {...register("description")} aria-label="Todo description" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Input type="date" {...register("dueDate")} aria-label="Due date" />
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" {...register("priority")} aria-label="Priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Input placeholder="tags: work, personal" {...register("tags")} aria-label="Tags" />
      </div>
      <Button disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Todo"}</Button>
    </form>
  );
};
