'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { LogOut, User } from 'lucide-react';
import { Badge } from '@smartclub/ui/badge';
import { Button } from '@smartclub/ui/button';
import { Separator } from '@smartclub/ui/separator';

export function UserMenu({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.staff');
  const tc = useTranslations('common');

  if (!session?.user) {
    return null;
  }

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      owner: t('owner'),
      manager: t('manager'),
      receptionist: t('receptionist'),
      cashier: t('cashier'),
    };
    return roleMap[role] || role;
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}/login` });
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{session.user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
        </div>
      </div>

      {session.user.role && (
        <div className="mb-3">
          <Badge variant="secondary" className="text-xs">
            {getRoleLabel(session.user.role)}
          </Badge>
        </div>
      )}

      <Separator className="my-3" />

      <Button
        onClick={handleLogout}
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        <span>{tc('logout')}</span>
      </Button>
    </div>
  );
}
