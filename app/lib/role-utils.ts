import { USER_ROLES, type UserRole } from "./db/schema";

// Role hierarchy - higher index = more permissions
const ROLE_HIERARCHY = [
  USER_ROLES.USER,
  USER_ROLES.MODERATOR,
  USER_ROLES.ADMIN,
] as const;

/**
 * Check if user has required role or higher
 */
export function hasRole(
  userRole: UserRole | null | undefined,
  requiredRole: UserRole
): boolean {
  if (!userRole) return false;

  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
}

/**
 * Check if user has admin permissions
 */
export function isAdmin(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, USER_ROLES.ADMIN);
}

/**
 * Check if user has moderator permissions or higher
 */
export function isModerator(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, USER_ROLES.MODERATOR);
}

/**
 * Check if user has at least user role (is authenticated)
 */
export function isUser(userRole: UserRole | null | undefined): boolean {
  return hasRole(userRole, USER_ROLES.USER);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "ადმინისტრატორი";
    case USER_ROLES.MODERATOR:
      return "მოდერატორი";
    case USER_ROLES.USER:
      return "მომხმარებელი";
    default:
      return "მომხმარებელი";
  }
}
