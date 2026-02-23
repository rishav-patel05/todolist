import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border border-white/20 bg-card/80 p-5 shadow-xl backdrop-blur", className)} {...props} />
);
