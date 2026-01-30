'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { faIR, enUS } from 'date-fns/locale';
import { Activity } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { ScrollArea } from '@smartclub/ui/scroll-area';
import { Badge } from '@smartclub/ui/badge';
import type { StaffMember, StaffActivity } from '@smartclub/types';

interface StaffActivityDialogProps {
  open: boolean;
  onClose: () => void;
  staff: StaffMember;
  activities: StaffActivity[];
}

export function StaffActivityDialog({
  open,
  onClose,
  staff,
  activities,
}: StaffActivityDialogProps) {
  const t = useTranslations('venue-admin.staff.activity');
  const locale = useLocale();

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPp', {
        locale: locale === 'fa' ? faIR : enUS,
      });
    } catch {
      return dateString;
    }
  };

  const getEntityBadgeColor = (entityType: string): string => {
    switch (entityType) {
      case 'booking':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'asset':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'customer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'venue':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')} - {staff.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('noActivity')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getEntityBadgeColor(activity.entityType)}>
                          {activity.entityType}
                        </Badge>
                        <span className="font-medium">{activity.action}</span>
                      </div>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDateTime(activity.timestamp)}</span>
                        {activity.ipAddress && (
                          <span className="font-mono">{activity.ipAddress}</span>
                        )}
                      </div>
                    </div>
                    {activity.entityId && (
                      <div className="text-xs text-muted-foreground font-mono">
                        #{activity.entityId.slice(0, 8)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
