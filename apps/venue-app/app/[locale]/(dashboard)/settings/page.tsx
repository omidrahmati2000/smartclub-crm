import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SettingsContent } from './_components/settings-content';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'venue-admin.settings' });

  return {
    title: t('title'),
  };
}

export default function SettingsPage() {
  return <SettingsContent />;
}
