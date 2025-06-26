import { Suspense } from "react";
import ServerAuthGuard from "../components/ServerAuthGuard";
import SavedHotCardsClient from "./SavedHotCardsClient";
import HotQuestionsGridSkeleton from "../hot-questions/HotQuestionsGridSkeleton";
import { getCurrentUser } from "../lib/auth-utils";

export default async function SavedHotCardsPage() {
  const user = await getCurrentUser();
  return (
    <ServerAuthGuard redirectTo="/login">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">შენახული კითხვები</h1>
          <p className="text-muted-foreground">
            თქვენს მიერ შენახული ცხელი კითხვები
          </p>
        </div>

        <Suspense fallback={<HotQuestionsGridSkeleton />}>
          <SavedHotCardsClient user={user} />
        </Suspense>
      </div>
    </ServerAuthGuard>
  );
}
