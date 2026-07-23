import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Program, Placement, Testimonial, AuditLog } from "@/lib/models";
import { GraduationCap, Send, Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";
import { hubHref, sectionItems, visibleSections } from "@/lib/admin-nav";

async function getStats() {
  try {
    await connectDB();
    const [programs, published, placements, testimonials, logs] =
      await Promise.all([
        Program.countDocuments({ is_active: true }),
        Program.countDocuments({ status: "published" }),
        Placement.countDocuments({ is_active: true }),
        Testimonial.countDocuments({ is_active: true }),
        AuditLog.find().sort({ created_at: -1 }).limit(10),
      ]);
    return { programs, published, placements, testimonials, logs };
  } catch {
    return {
      programs: 0,
      published: 0,
      placements: 0,
      testimonials: 0,
      logs: [],
    };
  }
}

export default async function DashboardPage() {
  const session = await auth();

  const role = (session?.user as Record<string, unknown>)?.role as string;
  if (role === "editor") {
    const institution = (session?.user as Record<string, unknown>)
      ?.institution as string;
    redirect(`/admin/hub/${institution || "engineering"}`);
  }

  const { programs, published, placements, testimonials, logs } =
    await getStats();

  const statCards = [
    {
      label: "Active Programs",
      value: programs,
      icon: GraduationCap,
      href: "/admin/programs",
    },
    {
      label: "Published Programs",
      value: published,
      icon: Send,
      href: "/admin/programs",
    },
    {
      label: "Placement Records",
      value: placements,
      icon: Briefcase,
      href: "/admin/placements",
    },
    {
      label: "Testimonials",
      value: testimonials,
      icon: MessageSquare,
      href: "/admin/testimonials",
    },
  ];

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">
              Welcome, {session?.user?.name?.split(" ")[0] ?? "Admin"}
            </h1>
            <p className="admin-page-subtitle">
              Here&apos;s what&apos;s happening across JCT Institutions.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="admin-card flex items-center gap-4 no-underline transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a1628]/8">
                <s.icon size={20} className="text-[#0a1628]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Content sections — each opens a hub listing its pages */}
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Manage Content
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSections(role ?? "admin", "all").map((s) => (
              <Link
                key={s.id}
                href={hubHref(s.id)}
                className="group admin-card flex items-start gap-3 no-underline transition-all hover:border-[#c9a84c] hover:shadow-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0a1628]/8 text-[#0a1628] transition-colors group-hover:bg-[#c9a84c]/20">
                  <s.icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    {s.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">
                    {s.description}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-gray-400">
                    {sectionItems(s, role ?? "admin").length} pages
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="admin-card">
          <h2 className="mb-4 font-semibold text-gray-800">Recent Activity</h2>
          {logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No activity yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Action</th>
                    <th>By</th>
                    <th>Summary</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: Record<string, unknown>) => (
                    <tr key={String(log._id)}>
                      <td>
                        <span className="admin-badge admin-badge-gray capitalize">
                          {String(log.entity_type)}
                        </span>
                      </td>
                      <td className="capitalize">{String(log.action)}</td>
                      <td className="text-gray-500">
                        {String(log.user_email)}
                      </td>
                      <td className="text-gray-600">{String(log.summary)}</td>
                      <td className="text-xs text-gray-400">
                        {new Date(log.created_at as string).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
