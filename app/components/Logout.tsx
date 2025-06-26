import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const Logout = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await authClient.signOut();
        toast.success("წარმატებით გამოხვედით");
        router.push("/");
        router.refresh(); // Force server components to re-render with new auth state
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("შეცდომა გასვლისას");
      }
    });
  };

  return (
    <Button onClick={handleLogout} disabled={isPending}>
      {isPending ? "გასვლა..." : "გასვლა"} <LogOut />
    </Button>
  );
};
