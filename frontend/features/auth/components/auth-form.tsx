"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export const AuthForm = ({ mode }: { mode: "login" | "register" }): JSX.Element => {
  const router = useRouter();
  const { fetchUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues): Promise<void> => {
    try {
      await authApi.csrf();
      if (mode === "register") {
        await authApi.register({
          name: data.name ?? "",
          email: data.email,
          password: data.password
        });
      } else {
        await authApi.login({ email: data.email, password: data.password });
      }
      await fetchUser();
      toast.success(mode === "register" ? "Welcome aboard" : "Welcome back");
      router.push("/");
    } catch {
      toast.error("Authentication failed");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="mx-auto w-full max-w-md">
        <h1 className="mb-4 text-2xl font-semibold">{mode === "register" ? "Create account" : "Sign in"}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label={`${mode} form`}>
          {mode === "register" && (
            <div>
              <Input placeholder="Name" aria-label="Name" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <Input placeholder="Email" type="email" aria-label="Email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <Input placeholder="Password" type="password" aria-label="Password" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : mode === "register" ? "Register" : "Login"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};
