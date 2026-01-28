import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OverviewPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OverviewContent />;
}

function OverviewContent() {
  const t = useTranslations();

  return (
    <div>
      <h1 className="text-3xl font-bold">{t('nav.dashboard')}</h1>
      <p className="mt-2 text-muted-foreground">venue-app | Venue Dashboard - coming soon</p>
    </div>
  );
}
