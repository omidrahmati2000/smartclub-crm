'use client';

import { useTranslations } from 'next-intl';
import {
  Target,
  Zap,
  Trophy,
  Crown,
  ArrowRight,
  Clock,
  CalendarDays,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@smartclub/ui';

const levels = [
  {
    key: 'beginner' as const,
    icon: Target,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-900/50',
  },
  {
    key: 'intermediate' as const,
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-900/50',
  },
  {
    key: 'advanced' as const,
    icon: Trophy,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-200 dark:border-purple-900/50',
  },
  {
    key: 'professional' as const,
    icon: Crown,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-900/50',
  },
];

export function TrainingLevels() {
  const t = useTranslations('venue-admin.coaches.trainingLevels');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {/* Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <Card key={level.key} className={`border-2 ${level.borderColor}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl ${level.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${level.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t(`${level.key}.title`)}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`${level.key}.description`)}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t('targetAudience')}:</span>
                    <span className="text-muted-foreground">{t(`${level.key}.audience`)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t('durationLabel')}:</span>
                    <span className="text-muted-foreground">{t(`${level.key}.duration`)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{t('frequencyLabel')}:</span>
                    <span className="text-muted-foreground">{t(`${level.key}.frequency`)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progression Path */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('progressionPath')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {levels.map((level, idx) => {
              const Icon = level.icon;
              return (
                <div key={level.key} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`h-14 w-14 rounded-full ${level.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-7 w-7 ${level.color}`} />
                    </div>
                    <span className="text-xs font-medium">{t(`${level.key}.title`)}</span>
                  </div>
                  {idx < levels.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
