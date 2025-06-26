import ServerAuthGuard from "../components/ServerAuthGuard";
import { getCurrentUser } from "../lib/auth-utils";

async function ProfileContent() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">პროფილი</h1>
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">სახელი</label>
            <p className="text-lg">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              ელ. ფოსტა
            </label>
            <p className="text-lg">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              რეგისტრაციის თარიღი
            </label>
            <p className="text-lg">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("ka-GE")
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ServerAuthGuard>
      <ProfileContent />
    </ServerAuthGuard>
  );
}
