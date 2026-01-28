import { Sidebar } from './_components/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen">
      <Sidebar locale={locale} />
      <main className="flex-1 overflow-auto bg-muted/10">
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
