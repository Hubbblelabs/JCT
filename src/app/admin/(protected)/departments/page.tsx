import { connectDB } from "@/lib/mongodb";
import { Department } from "@/lib/models";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getDepartments(college?: string) {
  try {
    await connectDB();
    const filter = college ? { college } : {};
    return Department.find(filter)
      .select("slug college content.name")
      .sort({ college: 1, slug: 1 })
      .lean();
  } catch {
    return [];
  }
}

const COLLEGE_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ college?: string }>;
}) {
  const { college } = await searchParams;
  const departments = await getDepartments(college);

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Departments</h1>
            <p className="admin-page-subtitle">
              {departments.length} {college ? COLLEGE_LABELS[college] ?? college : "total"} department{departments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <form action="/api/admin/departments/seed" method="POST">
              <button type="submit" className="admin-btn admin-btn-outline admin-btn-sm">
                Seed from data files
              </button>
            </form>
            <Link href="/admin/departments/new" className="admin-btn admin-btn-primary">
              <Plus size={16} /> New Department
            </Link>
          </div>
        </div>

        <div className="admin-card overflow-hidden p-0">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Slug</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-400">
                    No departments yet.{" "}
                    <Link href="/admin/departments/new" className="text-blue-600 underline">
                      Add one
                    </Link>{" "}
                    or seed from data files.
                  </td>
                </tr>
              )}
              {departments.map((d: Record<string, unknown>) => {
                const name = String((d.content as Record<string, unknown>)?.name ?? d.slug);
                return (
                  <tr key={String(d._id)}>
                    <td className="font-medium">{name}</td>
                    <td className="font-mono text-sm text-gray-500">{String(d.slug)}</td>
                    <td>
                      <Link
                        href={`/admin/departments/${String(d._id)}`}
                        className="admin-btn admin-btn-outline admin-btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
