import { getTranslations } from 'next-intl/server';
import { CustomersContent } from './_components/customers-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.customers');
  return {
    title: t('title'),
  };
}

export default function CustomersPage() {
  return <CustomersContent />;
}
