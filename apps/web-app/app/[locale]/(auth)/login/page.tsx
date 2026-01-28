import { getTranslations } from 'next-intl/server';
import { LoginForm } from './_components/login-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return {
    title: t('login.title'),
    description: t('login.description'),
  };
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
