import { z } from "zod";

const dateSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    return value;
  }

  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (isDateOnly) {
    return `${value}T00:00:00.000Z`;
  }

  return value;
}, z.string().refine((val) => !Number.isNaN(Date.parse(val)), "Invalid datetime").optional());

export const createTodoSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(1000).optional(),
  dueDate: dateSchema,
  priority: z.enum(["low", "medium", "high"]).optional(),
  tags: z.array(z.string().min(1).max(40)).optional()
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  completed: z.boolean().optional(),
  position: z.number().int().nonnegative().optional()
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1)
});

export const listTodoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  status: z.enum(["all", "completed", "pending"]).default("all"),
  priority: z.enum(["all", "low", "medium", "high"]).default("all"),
  due: z.enum(["all", "overdue", "today", "upcoming"]).default("all")
});
