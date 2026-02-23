"use client";

import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useTodoStore } from "@/store/todo-store";

export const TodoFilters = (): JSX.Element => {
  const { filters, setFilters } = useTodoStore();

  const updateSelect = (field: "status" | "priority" | "due") => (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters({ [field]: e.target.value, page: 1 });
  };

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input
        placeholder="Search title, description, tags"
        value={filters.q}
        onChange={(e) => setFilters({ q: e.target.value, page: 1 })}
        aria-label="Search todos"
      />
      <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filters.status} onChange={updateSelect("status")}>
        <option value="all">All status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
      <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filters.priority} onChange={updateSelect("priority")}>
        <option value="all">All priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={filters.due} onChange={updateSelect("due")}>
        <option value="all">All due dates</option>
        <option value="overdue">Overdue</option>
        <option value="today">Due today</option>
        <option value="upcoming">Upcoming</option>
      </select>
    </div>
  );
};
