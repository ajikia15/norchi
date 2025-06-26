import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { type UserRole } from "./db/schema";
import { isAdmin, isModerator } from "./role-utils";
import { db } from "./db/client";
import { user } from "./db/schema";
import { eq } from "drizzle-orm";

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

export const getCurrentUserWithRole = cache(async () => {
  const session = await getSession();
  if (!session?.user) return null;

  try {
    const userWithRole = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    return userWithRole[0] || null;
  } catch {
    return null;
  }
});

export const requireAuth = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
};

export const requireAdmin = async () => {
  const user = await getCurrentUserWithRole();
  if (!user || !isAdmin(user.role)) {
    throw new Error("Admin access required");
  }
  return user;
};

export const requireModerator = async () => {
  const user = await getCurrentUserWithRole();
  if (!user || !isModerator(user.role)) {
    throw new Error("Moderator access required");
  }
  return user;
};

export const getUserRole = async (): Promise<UserRole | null> => {
  const user = await getCurrentUserWithRole();
  return user?.role || null;
};
