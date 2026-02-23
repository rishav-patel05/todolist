"use client";

import { useMemo } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { GripVertical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Todo } from "@/lib/types";
import { useTodoStore } from "@/store/todo-store";
import { toast } from "sonner";

const Item = ({ todo }: { todo: Todo }): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });
  const { updateTodo, deleteTodo } = useTodoStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <motion.div layout ref={setNodeRef} style={style}>
      <Card className="mb-3 flex items-start justify-between gap-4">
        <div className="flex w-full gap-3">
          <button className="mt-1 text-muted-foreground" {...attributes} {...listeners} aria-label="Reorder todo">
            <GripVertical className="h-4 w-4" />
          </button>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => void updateTodo(todo.id, { completed: !todo.completed })}
            className="mt-1"
            aria-label={`Mark ${todo.title} complete`}
          />
          <div className="w-full">
            <p className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.title}</p>
            {todo.description && <p className="mt-1 text-sm text-muted-foreground">{todo.description}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-muted px-2 py-1 capitalize">{todo.priority}</span>
              {todo.dueDate && <span>Due {format(new Date(todo.dueDate), "PPP")}</span>}
              {todo.tags?.map((tag) => (
                <span className="rounded-full border px-2 py-1" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            void deleteTodo(todo.id);
            toast.success("Todo removed");
          }}
          aria-label="Delete todo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Card>
    </motion.div>
  );
};

export const TodoList = (): JSX.Element => {
  const { items, loading, reorderTodos } = useTodoStore();
  const sensors = useSensors(useSensor(PointerSensor));

  const ids = useMemo(() => items.map((todo) => todo.id), [items]);

  const onDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const newIds = arrayMove(ids, oldIndex, newIndex);
    try {
      await reorderTodos(newIds);
    } catch {
      toast.error("Could not reorder");
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="mb-3 h-24" />
        <Skeleton className="mb-3 h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <Card className="py-16 text-center" role="status" aria-live="polite">
        <p className="text-lg font-semibold">No todos yet</p>
        <p className="text-sm text-muted-foreground">Create your first task to get momentum.</p>
      </Card>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => void onDragEnd(e)}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <section id="todos" aria-label="Todo list">
          {items.map((todo) => (
            <Item key={todo.id} todo={todo} />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  );
};
