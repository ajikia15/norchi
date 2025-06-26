import { requireModerator } from "@/app/lib/auth-utils";
import { redirect } from "next/navigation";

interface ModeratorGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default async function ModeratorGuard({
  children,
  redirectTo = "/",
}: ModeratorGuardProps) {
  try {
    await requireModerator();
    return <>{children}</>;
  } catch {
    redirect(redirectTo);
  }
}
