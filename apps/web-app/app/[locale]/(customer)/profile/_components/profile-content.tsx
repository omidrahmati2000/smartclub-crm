'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { User, Settings, Shield } from 'lucide-react';
import { Card } from '@smartclub/ui';
import { Button } from '@smartclub/ui';
import { PersonalInfoTab } from './personal-info-tab';
import { PreferencesTab } from './preferences-tab';
import { SecurityTab } from './security-tab';

type TabType = 'info' | 'preferences' | 'security';

interface ProfileContentProps {
  locale: string;
}

export function ProfileContent({ locale }: ProfileContentProps) {
  const t = useTranslations('profile');
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const tabs = [
    { id: 'info' as TabType, label: t('tabs.info'), icon: User },
    { id: 'preferences' as TabType, label: t('tabs.preferences'), icon: Settings },
    { id: 'security' as TabType, label: t('tabs.security'), icon: Shield },
  ];

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* User Info Card */}
      <Card className="mb-6 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session?.user?.name || ''}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{session?.user?.name || 'User'}</h2>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            className="rounded-b-none"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'info' && <PersonalInfoTab />}
        {activeTab === 'preferences' && <PreferencesTab locale={locale} />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}
