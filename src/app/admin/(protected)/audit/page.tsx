export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";

async function getLogs() {
  try {
    await connectDB();
    return AuditLog.find().sort({ created_at: -1 }).limit(200).lean();
  } catch {
    return [];
  }
}

export default async function AuditPage() {
  const logs = await getLogs();

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Audit Log</h1>
            <p className="admin-page-subtitle">
              Last {logs.length} actions across the admin system
            </p>
          </div>
        </div>

        <div className="admin-card overflow-hidden p-0">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Action</th>
                <th>User</th>
                <th>Summary</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    No activity yet.
                  </td>
                </tr>
              )}
              {logs.map((log: Record<string, unknown>) => (
                <tr key={String(log._id)}>
                  <td>
                    <span className="admin-badge admin-badge-gray capitalize">
                      {String(log.entity_type)}
                    </span>
                  </td>
                  <td className="text-sm capitalize">{String(log.action)}</td>
                  <td className="text-sm text-gray-500">
                    {String(log.user_email)}
                  </td>
                  <td className="text-sm text-gray-600">
                    {String(log.summary)}
                  </td>
                  <td className="text-xs whitespace-nowrap text-gray-400">
                    {new Date(log.created_at as string).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
