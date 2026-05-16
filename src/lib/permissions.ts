export type Role = "viewer" | "editor" | "admin" | "super_admin";

const ROLE_RANK: Record<Role, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
  super_admin: 3,
};

export function hasMinRole(userRole: string, minRole: Role): boolean {
  return (ROLE_RANK[userRole as Role] ?? -1) >= ROLE_RANK[minRole];
}

export function canEdit(userRole: string): boolean {
  return hasMinRole(userRole, "editor");
}

export function canPublish(userRole: string): boolean {
  return hasMinRole(userRole, "admin");
}

export function canManageUsers(userRole: string): boolean {
  return hasMinRole(userRole, "super_admin");
}

export function canAccessDepartment(
  userRole: string,
  userInstitution: string,
  userDepartments: string[],
  targetDept: string,
  targetCollege: string,
): boolean {
  if (hasMinRole(userRole, "admin")) return true;
  if (userRole === "editor") {
    if (userInstitution !== "all" && userInstitution !== targetCollege)
      return false;
    return (
      userDepartments.length === 0 || userDepartments.includes(targetDept)
    );
  }
  return false;
}
