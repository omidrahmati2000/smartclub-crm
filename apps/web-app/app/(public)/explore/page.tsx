import { getTranslations } from 'next-intl/server';
import { ExploreContent } from './_components/explore-content';

export async function generateMetadata() {
  const t = await getTranslations('explore');

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ExplorePage() {
  return <ExploreContent />;
}
