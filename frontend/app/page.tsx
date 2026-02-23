"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { TodoFilters } from "@/features/todos/components/todo-filters";
import { TodoForm } from "@/features/todos/components/todo-form";
import { TodoList } from "@/features/todos/components/todo-list";
import { TodoPagination } from "@/features/todos/components/pagination";
import { TodoStats } from "@/features/todos/components/todo-stats";
import { useAuthStore } from "@/store/auth-store";
import { useTodos } from "@/features/todos/hooks/useTodos";

export default function HomePage(): JSX.Element {
  const { user, loading, fetchUser } = useAuthStore();
  const router = useRouter();
  const todos = useTodos();

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen p-4 sm:p-8">
        <Card className="h-52 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[280px_1fr]">
        <Sidebar />
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <TodoStats stats={todos.stats} />
          <Card>
            <TodoForm />
          </Card>
          <Card>
            <TodoFilters />
            <div className="mt-4">
              <TodoList />
              <TodoPagination />
            </div>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}
