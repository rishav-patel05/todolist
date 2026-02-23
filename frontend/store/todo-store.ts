"use client";

import { create } from "zustand";
import { todoApi } from "@/lib/api";
import { Todo, TodoFilters, TodoStats } from "@/lib/types";

export interface TodoState {
  items: Todo[];
  stats: TodoStats;
  pagination: { page: number; limit: number; total: number; pages: number };
  filters: TodoFilters;
  loading: boolean;
  setFilters: (next: Partial<TodoFilters>) => void;
  fetchTodos: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createTodo: (payload: Partial<Todo>) => Promise<void>;
  updateTodo: (id: string, payload: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  reorderTodos: (orderedIds: string[]) => Promise<void>;
}

const initialFilters: TodoFilters = {
  q: "",
  status: "all",
  priority: "all",
  due: "all",
  page: 1,
  limit: 10
};

export const useTodoStore = create<TodoState>((set, get) => ({
  items: [],
  stats: { total: 0, completed: 0, pending: 0, overdue: 0 },
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  filters: initialFilters,
  loading: false,
  setFilters: (next) => set((state) => ({ filters: { ...state.filters, ...next } })),
  fetchTodos: async () => {
    set({ loading: true });
    const data = await todoApi.list(get().filters);
    set({ items: data.items, pagination: data.pagination as never, loading: false });
  },
  fetchStats: async () => {
    const stats = await todoApi.stats();
    set({ stats });
  },
  createTodo: async (payload) => {
    const optimistic: Todo = {
      id: crypto.randomUUID(),
      title: payload.title ?? "",
      description: payload.description,
      completed: false,
      dueDate: payload.dueDate,
      priority: payload.priority ?? "medium",
      tags: payload.tags ?? [],
      position: get().items.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set((state) => ({ items: [optimistic, ...state.items] }));
    try {
      const saved = await todoApi.create(payload);
      set((state) => ({ items: state.items.map((t) => (t.id === optimistic.id ? saved : t)) }));
      await get().fetchStats();
    } catch {
      set((state) => ({ items: state.items.filter((t) => t.id !== optimistic.id) }));
      throw new Error("Failed to create todo");
    }
  },
  updateTodo: async (id, payload) => {
    const prev = get().items;
    set({ items: prev.map((todo) => (todo.id === id ? { ...todo, ...payload } : todo)) });
    try {
      const updated = await todoApi.update(id, payload);
      set((state) => ({ items: state.items.map((t) => (t.id === id ? updated : t)) }));
      await get().fetchStats();
    } catch {
      set({ items: prev });
      throw new Error("Failed to update todo");
    }
  },
  deleteTodo: async (id) => {
    const prev = get().items;
    set({ items: prev.filter((todo) => todo.id !== id) });
    try {
      await todoApi.remove(id);
      await get().fetchStats();
    } catch {
      set({ items: prev });
      throw new Error("Failed to delete todo");
    }
  },
  reorderTodos: async (orderedIds) => {
    const map = new Map(get().items.map((item) => [item.id, item]));
    const reordered = orderedIds.map((id, index) => ({ ...map.get(id)!, position: index }));
    const prev = get().items;
    set({ items: reordered });
    try {
      await todoApi.reorder(orderedIds);
    } catch {
      set({ items: prev });
      throw new Error("Failed to reorder todos");
    }
  }
}));
