'use client';

import { useTranslations } from 'next-intl';
import {
  Star,
  Users,
  Clock,
  DollarSign,
  MoreVertical,
  Mail,
  Phone,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@smartclub/ui';
import type { Coach } from '@smartclub/mock-data/src/fixtures/coaches';

interface CoachCardProps {
  coach: Coach;
  canManage: boolean;
  onViewProfile: () => void;
  onViewSchedule: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const levelColors: Record<string, string> = {
  Elite: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Head Coach': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Standard: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export function CoachCard({
  coach,
  canManage,
  onViewProfile,
  onViewSchedule,
  onEdit,
  onDelete,
  onToggleStatus,
}: CoachCardProps) {
  const t = useTranslations('venue-admin.coaches');

  const initials = coach.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="overflow-hidden border hover:border-primary/50 transition-all group">
      <CardContent className="p-6">
        {/* Header: Avatar + Name + Level */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-primary/10">
              <AvatarImage src={coach.avatar} alt={coach.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{coach.name}</h3>
              <p className="text-sm text-primary font-medium">{coach.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="secondary"
              className={`border-none text-xs ${levelColors[coach.level] || ''}`}
            >
              {coach.level}
            </Badge>
            {coach.status === 'inactive' && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {t('status.inactive')}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('card.experience')}</p>
              <p className="text-sm font-semibold">{coach.experience}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Star className="h-4 w-4 text-amber-500" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('card.rating')}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{coach.rating}</span>
                <span className="text-[10px] text-muted-foreground">({coach.reviews})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('card.students')}</p>
              <p className="text-sm font-semibold">{coach.students}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('card.hourlyRate')}</p>
              <p className="text-sm font-semibold">{coach.hourlyRate} AED</p>
            </div>
          </div>
        </div>

        {/* Contact row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1 truncate">
            <Mail className="h-3 w-3" /> {coach.email}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onViewProfile}>
          {t('card.viewProfile')}
        </Button>
        <Button size="sm" className="flex-1" onClick={onViewSchedule}>
          {t('card.viewSchedule')}
        </Button>
        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                {t('actions.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleStatus}>
                {coach.status === 'active' ? t('actions.deactivate') : t('actions.activate')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                {t('actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
}
