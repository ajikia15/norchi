import { getCurrentUser, getCurrentUserWithRole } from "@/app/lib/auth-utils";
import { isAdmin } from "@/app/lib/role-utils";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getCurrentUser();
  const userWithRole = await getCurrentUserWithRole();
  const isUserAdmin = userWithRole ? isAdmin(userWithRole.role) : false;

  return <Navbar user={user} isAdmin={isUserAdmin} />;
}
