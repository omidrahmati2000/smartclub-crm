import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginContent />;
}

function LoginContent() {
  const t = useTranslations();

  return (
    <div className="w-full max-w-md space-y-6 p-8">
      <h1 className="text-2xl font-bold text-center">{t('auth.login')}</h1>
      <p className="text-center text-muted-foreground">Coach Login - coming soon</p>
    </div>
  );
}
