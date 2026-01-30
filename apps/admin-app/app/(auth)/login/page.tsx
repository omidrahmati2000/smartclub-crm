import { useTranslations } from 'next-intl';

export default function LoginPage() {
  return <LoginContent />;
}

function LoginContent() {
  const t = useTranslations();

  return (
    <div className="w-full max-w-md space-y-6 p-8">
      <h1 className="text-2xl font-bold text-center">{t('auth.login')}</h1>
      <p className="text-center text-muted-foreground">Admin Login - coming soon</p>
    </div>
  );
}
