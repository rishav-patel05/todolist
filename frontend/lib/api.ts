import api from "./axios";
import { Todo, TodoFilters, TodoStats, User } from "./types";

export interface AuthPayload {
  name?: string;
  email: string;
  password: string;
}

export const authApi = {
  csrf: async (): Promise<void> => {
    await api.get("/auth/csrf");
  },
  register: async (payload: Required<Pick<AuthPayload, "name">> & AuthPayload): Promise<void> => {
    await api.post("/auth/register", payload);
  },
  login: async (payload: AuthPayload): Promise<void> => {
    await api.post("/auth/login", payload);
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  me: async (): Promise<User> => {
    const res = await api.get("/auth/me");
    return res.data.data;
  }
};

export const todoApi = {
  list: async (filters: TodoFilters): Promise<{ items: Todo[]; pagination: Record<string, number> }> => {
    const res = await api.get("/todos", { params: filters });
    return res.data.data;
  },
  stats: async (): Promise<TodoStats> => {
    const res = await api.get("/todos/stats");
    return res.data.data;
  },
  create: async (payload: Partial<Todo>): Promise<Todo> => {
    await authApi.csrf();
    const res = await api.post("/todos", payload);
    return res.data.data;
  },
  update: async (id: string, payload: Partial<Todo>): Promise<Todo> => {
    await authApi.csrf();
    const res = await api.patch(`/todos/${id}`, payload);
    return res.data.data;
  },
  remove: async (id: string): Promise<void> => {
    await authApi.csrf();
    await api.delete(`/todos/${id}`);
  },
  reorder: async (orderedIds: string[]): Promise<void> => {
    await authApi.csrf();
    await api.patch("/todos/reorder/all", { orderedIds });
  }
};
