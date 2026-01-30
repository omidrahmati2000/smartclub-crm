import { useTranslations } from 'next-intl';

export default function OverviewPage() {
  return <OverviewContent />;
}

function OverviewContent() {
  const t = useTranslations();

  return (
    <div>
      <h1 className="text-3xl font-bold">{t('nav.dashboard')}</h1>
      <p className="mt-2 text-muted-foreground">admin-app | Platform Admin Dashboard - coming soon</p>
    </div>
  );
}
