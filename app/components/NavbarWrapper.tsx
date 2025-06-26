import { getCurrentUser } from "@/app/lib/auth-utils";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getCurrentUser();

  return <Navbar user={user} />;
}
