"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TodoStats as StatsType } from "@/lib/types";

export const TodoStats = ({ stats }: { stats: StatsType }): JSX.Element => {
  const entries = [
    { label: "Total", value: stats.total },
    { label: "Completed", value: stats.completed },
    { label: "Pending", value: stats.pending },
    { label: "Overdue", value: stats.overdue }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" id="dashboard">
      {entries.map((entry, index) => (
        <motion.div key={entry.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
          <Card className="bg-gradient-to-br from-sky-500/10 to-emerald-500/10">
            <p className="text-sm text-muted-foreground">{entry.label}</p>
            <p className="mt-2 text-3xl font-bold">{entry.value}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
