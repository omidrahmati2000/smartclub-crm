import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { ExploreContent } from './_components/explore-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'explore' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ExplorePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExploreContent locale={locale} />;
}
