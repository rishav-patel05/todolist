import { Types } from "mongoose";
import { ITodo, Todo } from "../models/Todo";
import { AppError } from "../utils/appError";

interface ListFilters {
  page: number;
  limit: number;
  q?: string;
  status: "all" | "completed" | "pending";
  priority: "all" | "low" | "medium" | "high";
  due: "all" | "overdue" | "today" | "upcoming";
}

export const getTodoStats = async (userId: string): Promise<Record<string, number>> => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [total, completed, pending, overdue] = await Promise.all([
    Todo.countDocuments({ user: userId, deletedAt: null }),
    Todo.countDocuments({ user: userId, deletedAt: null, completed: true }),
    Todo.countDocuments({ user: userId, deletedAt: null, completed: false }),
    Todo.countDocuments({ user: userId, deletedAt: null, completed: false, dueDate: { $lt: todayStart } })
  ]);

  return { total, completed, pending, overdue };
};

export const listTodos = async (userId: string, filters: ListFilters): Promise<{ items: ITodo[]; total: number }> => {
  const query: Record<string, unknown> = { user: userId, deletedAt: null };
  if (filters.q) {
    query.$or = [
      { title: { $regex: filters.q, $options: "i" } },
      { description: { $regex: filters.q, $options: "i" } },
      { tags: { $in: [new RegExp(filters.q, "i")] } }
    ];
  }
  if (filters.status === "completed") query.completed = true;
  if (filters.status === "pending") query.completed = false;
  if (filters.priority !== "all") query.priority = filters.priority;

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (filters.due === "overdue") query.dueDate = { $lt: start };
  if (filters.due === "today") query.dueDate = { $gte: start, $lt: end };
  if (filters.due === "upcoming") query.dueDate = { $gte: end };

  const skip = (filters.page - 1) * filters.limit;

  const [items, total] = await Promise.all([
    Todo.find(query).sort({ position: 1, createdAt: -1 }).skip(skip).limit(filters.limit),
    Todo.countDocuments(query)
  ]);

  return { items, total };
};

export const createTodo = async (
  userId: string,
  payload: Partial<ITodo>
): Promise<ITodo> => {
  const lastTodo = await Todo.findOne({ user: userId, deletedAt: null }).sort({ position: -1 });
  const position = (lastTodo?.position ?? -1) + 1;

  return Todo.create({
    ...payload,
    user: userId,
    position,
    deletedAt: null
  });
};

export const updateTodo = async (
  userId: string,
  todoId: string,
  payload: Partial<ITodo>
): Promise<ITodo> => {
  const todo = await Todo.findOneAndUpdate(
    { _id: todoId, user: userId, deletedAt: null },
    payload,
    { new: true }
  );

  if (!todo) {
    throw new AppError("Todo not found", 404);
  }

  return todo;
};

export const softDeleteTodo = async (userId: string, todoId: string): Promise<void> => {
  const todo = await Todo.findOneAndUpdate(
    { _id: todoId, user: userId, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!todo) {
    throw new AppError("Todo not found", 404);
  }
};

export const reorderTodos = async (userId: string, orderedIds: string[]): Promise<void> => {
  const objectIds = orderedIds.map((id) => new Types.ObjectId(id));
  const todos = await Todo.find({ _id: { $in: objectIds }, user: userId, deletedAt: null }).lean();
  if (todos.length !== orderedIds.length) {
    throw new AppError("One or more todos not found", 404);
  }

  const bulk = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, user: userId, deletedAt: null },
      update: { $set: { position: index } }
    }
  }));

  await Todo.bulkWrite(bulk);
};
