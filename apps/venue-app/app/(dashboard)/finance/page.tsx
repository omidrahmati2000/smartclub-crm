import { getTranslations } from 'next-intl/server';
import { FinanceContent } from './_components/finance-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.finance');
  return {
    title: t('title'),
  };
}

export default function FinancePage() {
  return <FinanceContent />;
}
