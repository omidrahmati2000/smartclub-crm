export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-e bg-card p-4">
        <h2 className="text-lg font-bold mb-4">Coach Panel</h2>
        <nav className="space-y-2 text-sm">
          <p>Coach sidebar - coming soon</p>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
