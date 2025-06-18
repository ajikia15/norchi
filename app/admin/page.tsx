"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/story");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="text-2xl font-semibold text-gray-600 animate-pulse">
        Redirecting to admin panel...
      </div>
    </div>
  );
}
