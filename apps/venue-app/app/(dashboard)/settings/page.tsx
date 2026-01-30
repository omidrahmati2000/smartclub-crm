import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SettingsContent } from './_components/settings-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('venue-admin.settings');

  return {
    title: t('title'),
  };
}

export default function SettingsPage() {
  return <SettingsContent />;
}
