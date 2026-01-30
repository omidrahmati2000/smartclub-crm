import { getTranslations } from 'next-intl/server';
import { ProfileContent } from './_components/profile-content';

export async function generateMetadata() {
  const t = await getTranslations('profile');

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ProfilePage() {
  return <ProfileContent />;
}
