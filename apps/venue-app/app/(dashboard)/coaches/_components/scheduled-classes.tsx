'use client';

import { useTranslations } from 'next-intl';
import {
  Calendar,
  Plus,
  Users,
  User,
  BookOpen,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@smartclub/ui';
import type { Coach, CoachSessionFixture } from '@smartclub/mock-data/src/fixtures/coaches';

interface ScheduledClassesProps {
  sessions: CoachSessionFixture[];
  coaches: Coach[];
  canManage: boolean;
  onAddSession: () => void;
}

const typeIcons: Record<string, typeof User> = {
  private: User,
  group: Users,
  class: BookOpen,
};

const typeColors: Record<string, string> = {
  private: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  group: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export function ScheduledClasses({ sessions, coaches, canManage, onAddSession }: ScheduledClassesProps) {
  const t = useTranslations('venue-admin.coaches');

  const getCoachName = (coachId: string) => {
    return coaches.find((c) => c.id === coachId)?.name || 'Unknown';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('classes.title')}</CardTitle>
          <CardDescription>{t('classes.description')}</CardDescription>
        </div>
        {canManage && (
          <Button size="sm" className="gap-2" onClick={onAddSession}>
            <Plus className="h-4 w-4" />
            {t('classes.addSession')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">{t('classes.noSessions')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const TypeIcon = typeIcons[session.type] || Calendar;
              return (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 p-4 border rounded-xl hover:bg-muted/30 transition-colors sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${typeColors[session.type] || 'bg-primary/10 text-primary'}`}>
                      <TypeIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getCoachName(session.coachId)} &bull;{' '}
                        {new Date(session.startTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        {new Date(session.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <Badge variant="secondary" className={`text-xs ${typeColors[session.type] || ''}`}>
                      {t(`classes.type.${session.type}`)}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${statusColors[session.status] || ''}`}>
                      {t(`classes.status.${session.status}`)}
                    </Badge>
                    <div className="text-right min-w-[80px]">
                      <p className="text-xs text-muted-foreground uppercase font-bold">{t('classes.price')}</p>
                      <p className="font-mono font-bold text-sm">{session.price} AED</p>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <p className="text-xs text-muted-foreground uppercase font-bold">{t('classes.enrollment')}</p>
                      <p className="font-bold text-sm">{session.enrolledCount}/{session.maxStudents}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
