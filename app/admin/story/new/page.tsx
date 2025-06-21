import { redirect } from "next/navigation";

export default function NewStoryPage() {
  redirect("/admin?tab=stories");
}
