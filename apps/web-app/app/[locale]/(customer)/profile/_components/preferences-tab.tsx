'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Bell } from 'lucide-react';
import { Card } from '@smartclub/ui';
import { Button } from '@smartclub/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { Label } from '@smartclub/ui/label';

interface PreferencesTabProps {
  locale: string;
}

export function PreferencesTab({ locale }: PreferencesTabProps) {
  const t = useTranslations('profile');
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    reminders: true,
    promotions: false,
  });

  const handleLanguageChange = (newLocale: string) => {
    // Replace the current locale in the pathname
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Language */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{t('preferences.language')}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('preferences.languageDescription')}
            </p>
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fa">{t('languages.fa')}</SelectItem>
                <SelectItem value="en">{t('languages.en')}</SelectItem>
                <SelectItem value="ar">{t('languages.ar')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{t('preferences.notifications')}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('preferences.notificationsDescription')}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">
                  {t('preferences.emailNotifications')}
                </Label>
                <Button
                  variant={notifications.email ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleNotification('email')}
                >
                  {notifications.email ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">
                  {t('preferences.pushNotifications')}
                </Label>
                <Button
                  variant={notifications.push ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleNotification('push')}
                >
                  {notifications.push ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">
                  {t('preferences.smsNotifications')}
                </Label>
                <Button
                  variant={notifications.sms ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleNotification('sms')}
                >
                  {notifications.sms ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="booking-reminders">
                  {t('preferences.bookingReminders')}
                </Label>
                <Button
                  variant={notifications.reminders ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleNotification('reminders')}
                >
                  {notifications.reminders ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="promotions">{t('preferences.promotions')}</Label>
                <Button
                  variant={notifications.promotions ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleNotification('promotions')}
                >
                  {notifications.promotions ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
