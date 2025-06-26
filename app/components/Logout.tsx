import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Logout = () => {
  const handleLogout = async () => {
    await authClient.signOut();
  };
  return (
    <Button onClick={handleLogout}>
      გასვლა <LogOut />
    </Button>
  );
};
