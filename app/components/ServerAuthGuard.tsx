import { getSession } from "@/app/lib/auth-utils";
import { redirect } from "next/navigation";

interface ServerAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default async function ServerAuthGuard({
  children,
  redirectTo = "/login",
}: ServerAuthGuardProps) {
  const session = await getSession();

  if (!session) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
