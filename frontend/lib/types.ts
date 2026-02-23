export type Priority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: Priority;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilters {
  q: string;
  status: "all" | "completed" | "pending";
  priority: "all" | Priority;
  due: "all" | "overdue" | "today" | "upcoming";
  page: number;
  limit: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}
