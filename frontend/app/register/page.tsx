import Link from "next/link";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function RegisterPage(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AuthForm mode="register" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary underline">Login</Link>
        </p>
      </div>
    </main>
  );
}
