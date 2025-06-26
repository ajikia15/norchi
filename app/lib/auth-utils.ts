import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

// Cached for performance in SSR
export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    return null;
  }
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

export const requireAuth = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
};
