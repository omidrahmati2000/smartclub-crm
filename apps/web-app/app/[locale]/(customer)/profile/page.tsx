import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { ProfileContent } from './_components/profile-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'profile' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProfileContent locale={locale} />;
}
