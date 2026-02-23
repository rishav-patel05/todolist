"use client";

import { useEffect } from "react";
import { TodoState, useTodoStore } from "@/store/todo-store";

export const useTodos = (): TodoState => {
  const store = useTodoStore();

  useEffect(() => {
    void store.fetchTodos();
    void store.fetchStats();
  }, [store.filters.page, store.filters.limit, store.filters.status, store.filters.priority, store.filters.due, store.filters.q]);

  return store;
};
