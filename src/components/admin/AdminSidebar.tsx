"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  Briefcase,
  MessageSquare,
  Image,
  Settings,
  ClipboardList,
  GraduationCap,
} from "lucide-react";

const NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Departments", href: "/admin/departments", icon: Building2 },
      { label: "Programs", href: "/admin/programs", icon: GraduationCap },
      { label: "Recruiters", href: "/admin/recruiters", icon: Briefcase },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    ],
  },
  {
    section: "Settings",
    items: [
      { label: "Site Config", href: "/admin/site-config", icon: Settings },
      { label: "Images", href: "/admin/images", icon: Image },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Audit Log", href: "/admin/audit", icon: ClipboardList },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="flex items-center gap-2">
          <BookOpen size={20} color="#c9a84c" />
          <div>
            <p className="text-sm font-bold text-white">JCT Admin</p>
            <p className="text-[10px] text-white/40">Content Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="admin-nav-section">{group.section}</p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${active ? "active" : ""}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <p className="text-center text-[10px] text-white/30">JCT Institutions v2</p>
      </div>
    </aside>
  );
}
