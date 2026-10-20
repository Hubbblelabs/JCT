"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, KeyRound, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

/** "Audit Admin" → "AA", "editor@jct.ac.in" → "E". */
function initials(name: string): string {
  const words = name
    .replace(/@.*$/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * The foot of the sidebar: the account menu. Search lives in the topbar (and
 * on Ctrl K); Clear cache is an operator tool and lives on Backup & restore.
 *
 * The row carries its label in `.admin-sidebar-label`, so the collapsed rail
 * shows just the avatar and reveals the name on hover like the nav above.
 */
export function AdminSidebarFooter({
  userName,
  userRole,
  collapsed,
  onChangePassword,
  onNavigate,
}: {
  userName: string;
  userRole: string;
  collapsed: boolean;
  onChangePassword: () => void;
  /** Closes the mobile drawer once an action is picked. */
  onNavigate?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="admin-sidebar-footer">
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="admin-sidebar-link admin-sidebar-tool admin-sidebar-user"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title={collapsed ? userName : undefined}
        >
          <span className="admin-avatar" aria-hidden="true">
            {initials(userName)}
          </span>
          <span className="admin-sidebar-label admin-sidebar-user-text">
            <span className="admin-sidebar-user-name">{userName}</span>
            <span className="admin-sidebar-user-role">{userRole}</span>
          </span>
          <ChevronsUpDown
            size={14}
            className="admin-sidebar-label shrink-0 opacity-70"
            aria-hidden="true"
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute bottom-full left-0 z-[var(--admin-z-modal)] mb-1 w-56 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-raised)] p-1 shadow-[var(--admin-shadow-lg)]"
          >
            <div className="border-b border-[var(--admin-border-subtle)] px-3 py-2">
              <p className="truncate text-[length:var(--admin-text-body)] font-semibold text-[var(--admin-text)]">
                {userName}
              </p>
              <p className="text-[length:var(--admin-text-sm)] text-[var(--admin-text-muted)] capitalize">
                {userRole}
                {userRole === "editor" && " · scoped to one college"}
              </p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onNavigate?.();
                onChangePassword();
              }}
              className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-block mt-1 justify-start"
            >
              <KeyRound size={14} />
              Change password
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-block justify-start"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
