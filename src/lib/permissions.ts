export type Role = "admin" | "editor";

const ROLE_RANK: Record<Role, number> = {
  editor: 0,
  admin: 1,
};

export function hasMinRole(userRole: string, minRole: Role): boolean {
  return (ROLE_RANK[userRole as Role] ?? -1) >= ROLE_RANK[minRole];
}

export function canManageUsers(userRole: string): boolean {
  return hasMinRole(userRole, "admin");
}

export function canAccessInstitution(
  userRole: string,
  userInstitution: string,
  targetInstitution: string,
): boolean {
  if (userRole === "admin") return true;
  return userInstitution === targetInstitution;
}

export function canAccessProgram(
  userRole: string,
  userInstitution: string,
  _userPrograms: string[],
  _targetProgram: string,
  targetInstitution: string,
): boolean {
  return canAccessInstitution(userRole, userInstitution, targetInstitution);
}
