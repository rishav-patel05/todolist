"use client";

import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/store/todo-store";

export const TodoPagination = (): JSX.Element => {
  const { pagination, filters, setFilters } = useTodoStore();

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.pages || 1}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={filters.page <= 1} onClick={() => setFilters({ page: filters.page - 1 })}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.pages === 0 || filters.page >= pagination.pages}
          onClick={() => setFilters({ page: filters.page + 1 })}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
