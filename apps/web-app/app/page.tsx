import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui';
import Link from 'next/link';

export default function HomePage() {
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t('app.name')}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('app.tagline')}
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/explore">
          <Button size="lg">{t('nav.explore')}</Button>
        </Link>
        <Link href="/explore">
          <Button size="lg" variant="outline">{t('nav.login')}</Button>
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        web-app | {t('app.name')}
      </p>
    </main>
  );
}
