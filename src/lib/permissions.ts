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

// `canAccessProgram` used to live here. It took a `programs[]` allowlist and a
// target program and then ignored both, delegating to canAccessInstitution —
// so a caller reading the signature would believe program-level authorisation
// existed when scope is, and only ever was, institution-level. Nothing called
// it. Removed rather than left as a trap.
//
// The `User.programs[]` field and its session/JWT copy still exist but are
// read by nothing; the admin UI no longer offers per-program permissions.
