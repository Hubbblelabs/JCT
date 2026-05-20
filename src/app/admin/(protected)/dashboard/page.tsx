import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Program, Recruiter, Testimonial, AuditLog } from "@/lib/models";
import { GraduationCap, Send, Briefcase, MessageSquare } from "lucide-react";

async function getStats() {
  try {
    await connectDB();
    const [programs, published, recruiters, testimonials, logs] =
      await Promise.all([
        Program.countDocuments({ is_active: true }),
        Program.countDocuments({ status: "published" }),
        Recruiter.countDocuments({ is_active: true }),
        Testimonial.countDocuments({ is_active: true }),
        AuditLog.find().sort({ created_at: -1 }).limit(10),
      ]);
    return { programs, published, recruiters, testimonials, logs };
  } catch {
    return {
      programs: 0,
      published: 0,
      recruiters: 0,
      testimonials: 0,
      logs: [],
    };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const { programs, published, recruiters, testimonials, logs } =
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
      label: "Recruiters",
      value: recruiters,
      icon: Briefcase,
      href: "/admin/recruiters",
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

        {/* Recent activity */}
        <div className="admin-card">
          <h2 className="mb-4 font-semibold text-gray-800">Recent Activity</h2>
          {logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No activity yet.
            </p>
          ) : (
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
                    <td className="text-gray-500">{String(log.user_email)}</td>
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
          )}
        </div>
      </div>
    </>
  );
}
