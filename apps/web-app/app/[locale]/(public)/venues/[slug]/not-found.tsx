import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@smartclub/ui/button';
import { SearchX } from 'lucide-react';

export default function VenueNotFound() {
  const t = useTranslations('venue.notFound');

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <SearchX className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-3 text-muted-foreground max-w-md">{t('description')}</p>

        <div className="mt-8">
          <Button asChild>
            <Link href="/explore">{t('backToExplore')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
