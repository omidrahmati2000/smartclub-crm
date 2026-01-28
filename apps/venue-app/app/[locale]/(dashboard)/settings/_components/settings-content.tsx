'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@smartclub/ui';
import { VenueProfileForm } from './venue-profile-form';
import { OperatingHoursForm } from './operating-hours-form';
import { BookingRulesForm } from './booking-rules-form';
import { WhiteLabelSettingsForm } from './white-label-settings';
import { NotificationSettingsForm } from './notification-settings';

type SettingsTab = 'profile' | 'hours' | 'bookingRules' | 'whiteLabel' | 'notifications';

export function SettingsContent() {
  const t = useTranslations('venue-admin.settings');
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: t('tabs.profile') },
    { id: 'hours', label: t('tabs.hours') },
    { id: 'bookingRules', label: t('tabs.bookingRules') },
    { id: 'whiteLabel', label: t('tabs.whiteLabel') },
    { id: 'notifications', label: t('tabs.notifications') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 rtl:space-x-reverse">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profile' && <VenueProfileForm />}
        {activeTab === 'hours' && <OperatingHoursForm />}
        {activeTab === 'bookingRules' && <BookingRulesForm />}
        {activeTab === 'whiteLabel' && <WhiteLabelSettingsForm />}
        {activeTab === 'notifications' && <NotificationSettingsForm />}
      </div>
    </div>
  );
}
