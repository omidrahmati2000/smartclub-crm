'use client';

import { useTranslations } from 'next-intl';
import {
  Star,
  Users,
  Clock,
  Mail,
  Phone,
  Award,
  Calendar,
  DollarSign,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import {
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@smartclub/ui';
import type { Coach, CoachSessionFixture } from '@smartclub/mock-data/src/fixtures/coaches';

interface CoachProfileDialogProps {
  open: boolean;
  onClose: () => void;
  coach: Coach;
  sessions: CoachSessionFixture[];
  defaultTab?: 'overview' | 'schedule' | 'stats';
}

const levelColors: Record<string, string> = {
  Elite: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Head Coach': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Standard: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

const typeColors: Record<string, string> = {
  private: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  group: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export function CoachProfileDialog({
  open,
  onClose,
  coach,
  sessions,
  defaultTab = 'overview',
}: CoachProfileDialogProps) {
  const t = useTranslations('venue-admin.coaches');

  const initials = coach.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const totalSessionRevenue = sessions.reduce((sum, s) => sum + s.price * s.enrolledCount, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={coach.avatar} alt={coach.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{coach.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary font-medium">{coach.specialty}</span>
                <Badge variant="secondary" className={`border-none text-xs ${levelColors[coach.level] || ''}`}>
                  {coach.level}
                </Badge>
                <Badge variant={coach.status === 'active' ? 'default' : 'outline'} className="text-xs">
                  {t(`status.${coach.status}`)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">{t('profile.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="schedule">{t('profile.tabs.schedule')}</TabsTrigger>
            <TabsTrigger value="stats">{t('profile.tabs.stats')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Bio */}
            {coach.bio && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">{t('profile.bio')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{coach.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">{t('profile.contact')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{coach.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span dir="ltr">{coach.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{coach.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{coach.hourlyRate} AED / hr</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    {t('card.rating')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold">{coach.rating}</p>
                      <p className="text-xs text-muted-foreground">{coach.reviews} reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{coach.students}</p>
                      <p className="text-xs text-muted-foreground">{t('card.students')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certifications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {t('profile.certifications')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coach.certifications && coach.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {coach.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('profile.issuedBy', { org: cert.issuedBy })} ({cert.year})
                          </p>
                        </div>
                        <Award className="h-5 w-5 text-primary/40" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('profile.noCertifications')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-4 space-y-3">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">{t('profile.noSessions')}</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
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
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={`text-xs ${typeColors[session.type] || ''}`}>
                      {session.type}
                    </Badge>
                    <span className="text-sm font-mono font-semibold">{session.price} AED</span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-3xl font-bold">{sessions.length}</p>
                  <p className="text-sm text-muted-foreground">{t('profile.stats.totalSessions')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-3xl font-bold">{totalSessionRevenue.toLocaleString()} AED</p>
                  <p className="text-sm text-muted-foreground">{t('profile.stats.estimatedRevenue')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Star className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-3xl font-bold">{coach.rating}</p>
                  <p className="text-sm text-muted-foreground">{t('profile.stats.avgRating')}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
