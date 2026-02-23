import Link from "next/link";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function LoginPage(): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No account? <Link href="/register" className="text-primary underline">Register</Link>
        </p>
      </div>
    </main>
  );
}
