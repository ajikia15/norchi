import { LoginForm } from "@/components/login-form";
import Logo from "../components/Logo";
import { getSession } from "../lib/auth-utils";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Redirect if already authenticated
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="bg-muted min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo />
        <LoginForm />
      </div>
    </div>
  );
}
