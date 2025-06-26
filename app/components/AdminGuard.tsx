import { requireAdmin } from "@/app/lib/auth-utils";
import { redirect } from "next/navigation";

interface AdminGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default async function AdminGuard({
  children,
  redirectTo = "/",
}: AdminGuardProps) {
  try {
    await requireAdmin();
    return <>{children}</>;
  } catch {
    redirect(redirectTo);
  }
}
