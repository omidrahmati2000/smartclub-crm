import { getTranslations } from 'next-intl/server';
import { RegisterForm } from './_components/register-form';

export async function generateMetadata() {
  const t = await getTranslations('auth');

  return {
    title: t('register.title'),
    description: t('register.description'),
  };
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
