"use server";
import { db } from "@/app/lib/db/client";
import { user } from "@/app/lib/db/schema";
import { USER_ROLES } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/app/lib/auth-utils";

/**
 * Grant admin role to a user by email
 * Can only be called by existing admins
 */
export async function grantAdminRole(email: string) {
  try {
    await requireAdmin();

    const result = await db
      .update(user)
      .set({ role: USER_ROLES.ADMIN })
      .where(eq(user.email, email))
      .returning();

    if (result.length === 0) {
      throw new Error("User not found");
    }

    return { success: true, message: `Admin role granted to ${email}` };
  } catch (error) {
    const e = error as Error;
    throw new Error(e.message || "Failed to grant admin role");
  }
}

/**
 * Grant moderator role to a user by email
 * Can only be called by existing admins
 */
export async function grantModeratorRole(email: string) {
  try {
    await requireAdmin();

    const result = await db
      .update(user)
      .set({ role: USER_ROLES.MODERATOR })
      .where(eq(user.email, email))
      .returning();

    if (result.length === 0) {
      throw new Error("User not found");
    }

    return { success: true, message: `Moderator role granted to ${email}` };
  } catch (error) {
    const e = error as Error;
    throw new Error(e.message || "Failed to grant moderator role");
  }
}
