export function AdminTopBar({ title }: { title?: string }) {
  return (
    <header className="admin-topbar">
      <span className="text-sm font-semibold text-gray-700">{title ?? "Admin"}</span>
    </header>
  );
}
