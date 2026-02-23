import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createTodo, getTodoStats, listTodos, reorderTodos, softDeleteTodo, updateTodo } from "../services/todo.service";

type TodoListQuery = {
  page: number;
  limit: number;
  q?: string;
  status: "all" | "completed" | "pending";
  priority: "all" | "low" | "medium" | "high";
  due: "all" | "overdue" | "today" | "upcoming";
};

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getTodoStats(req.user!.id);
  res.json({ success: true, data: stats });
});

export const getTodos = asyncHandler(async (req: Request, res: Response) => {
  const filters = req.query as unknown as TodoListQuery;
  const { items, total } = await listTodos(req.user!.id, filters);
  const { page, limit } = filters;

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

export const createTodoHandler = asyncHandler(async (req: Request, res: Response) => {
  const todo = await createTodo(req.user!.id, req.body);
  res.status(201).json({ success: true, data: todo });
});

export const updateTodoHandler = asyncHandler(async (req: Request, res: Response) => {
  const todo = await updateTodo(req.user!.id, req.params.id, req.body);
  res.json({ success: true, data: todo });
});

export const deleteTodoHandler = asyncHandler(async (req: Request, res: Response) => {
  await softDeleteTodo(req.user!.id, req.params.id);
  res.json({ success: true, message: "Todo deleted" });
});

export const reorderTodosHandler = asyncHandler(async (req: Request, res: Response) => {
  await reorderTodos(req.user!.id, req.body.orderedIds);
  res.json({ success: true, message: "Reordered successfully" });
});
