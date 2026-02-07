'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  GraduationCap,
  Plus,
  Users,
  Calendar,
  Award,
} from 'lucide-react';
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@smartclub/ui';
import { useToast } from '@smartclub/ui/use-toast';
import { Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { apiClient } from '@/lib/api-client';
import type { Coach, CoachSessionFixture } from '@smartclub/mock-data/src/fixtures/coaches';

import { CoachFilters } from './coach-filters';
import { CoachCard } from './coach-card';
import { CoachProfileDialog } from './coach-profile-dialog';
import { RegisterCoachDialog } from './register-coach-dialog';
import { EditCoachDialog } from './edit-coach-dialog';
import { DeleteCoachDialog } from './delete-coach-dialog';
import { ScheduledClasses } from './scheduled-classes';
import { AddSessionDialog } from './add-session-dialog';
import { TrainingLevels } from './training-levels';

export function CoachesContent() {
  const t = useTranslations('venue-admin.coaches');
  const { toast } = useToast();
  const { data: session } = useSession();
  const user = session?.user as any;
  const venueId = user?.venueId || user?.currentVenue || 'venue-1';

  const canView = hasPermission(user, Permission.COACH_VIEW) || hasPermission(user, Permission.COACH_MANAGE);
  const canManage = hasPermission(user, Permission.COACH_MANAGE);

  // Data state
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [sessions, setSessions] = useState<CoachSessionFixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Dialog state
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showAddSessionDialog, setShowAddSessionDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'schedule' | 'stats'>('overview');

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [coachesResult, sessionsResult] = await Promise.all([
          apiClient.get<Coach[]>(`/venues/${venueId}/coaches`),
          apiClient.get<CoachSessionFixture[]>(`/venues/${venueId}/coach-sessions`),
        ]);
        if (coachesResult.success && coachesResult.data) {
          setCoaches(coachesResult.data);
        }
        if (sessionsResult.success && sessionsResult.data) {
          setSessions(sessionsResult.data);
        }
      } catch {
        toast({ title: 'Error', description: t('toast.error'), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    }

    if (venueId) {
      fetchData();
    }
  }, [venueId]);

  // Filtered and sorted coaches
  const filteredCoaches = useMemo(() => {
    let result = [...coaches];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.specialty.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      result = result.filter((c) => c.level === levelFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.students - a.students;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [coaches, searchQuery, levelFilter, statusFilter, sortBy]);

  // Handlers
  const handleCoachCreated = (newCoach: Coach) => {
    setCoaches((prev) => [...prev, newCoach]);
    setShowRegisterDialog(false);
  };

  const handleCoachUpdated = (updated: Coach) => {
    setCoaches((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setShowEditDialog(false);
    setSelectedCoach(null);
  };

  const handleCoachDeleted = async (coachId: string) => {
    try {
      const result = await apiClient.delete(`/coaches/${coachId}`);
      if (result.success) {
        setCoaches((prev) => prev.filter((c) => c.id !== coachId));
        toast({ title: t('toast.deleted') });
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: 'Error', description: t('toast.error'), variant: 'destructive' });
    }
    setShowDeleteDialog(false);
    setSelectedCoach(null);
  };

  const handleStatusToggle = async (coach: Coach) => {
    const newStatus = coach.status === 'active' ? 'inactive' : 'active';
    try {
      const result = await apiClient.patch<Coach>(`/coaches/${coach.id}/status`, { status: newStatus });
      if (result.success && result.data) {
        setCoaches((prev) => prev.map((c) => (c.id === coach.id ? result.data! : c)));
        toast({ title: newStatus === 'active' ? t('toast.activated') : t('toast.deactivated') });
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: 'Error', description: t('toast.error'), variant: 'destructive' });
    }
  };

  const handleSessionCreated = (newSession: CoachSessionFixture) => {
    setSessions((prev) => [...prev, newSession]);
    setShowAddSessionDialog(false);
  };

  const handleViewProfile = (coach: Coach, tab: 'overview' | 'schedule' | 'stats' = 'overview') => {
    setSelectedCoach(coach);
    setProfileTab(tab);
    setShowProfileDialog(true);
  };

  const handleEditCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowEditDialog(true);
  };

  const handleDeleteCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    setShowDeleteDialog(true);
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t('noPermission')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        {canManage && (
          <Button className="gap-2" onClick={() => setShowRegisterDialog(true)}>
            <Plus className="h-4 w-4" />
            {t('registerCoach')}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="roster" className="w-full">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="roster" className="gap-2">
            <Users className="h-4 w-4" />
            {t('tabs.roster')}
          </TabsTrigger>
          <TabsTrigger value="classes" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t('tabs.classes')}
          </TabsTrigger>
          <TabsTrigger value="levels" className="gap-2">
            <Award className="h-4 w-4" />
            {t('tabs.levels')}
          </TabsTrigger>
        </TabsList>

        {/* Roster Tab */}
        <TabsContent value="roster" className="mt-6 space-y-6">
          <CoachFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            levelFilter={levelFilter}
            onLevelChange={setLevelFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <p className="text-sm text-muted-foreground">
            {t('showingResults', { count: filteredCoaches.length })}
          </p>

          {filteredCoaches.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">{t('noCoaches')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCoaches.map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  canManage={canManage}
                  onViewProfile={() => handleViewProfile(coach)}
                  onViewSchedule={() => handleViewProfile(coach, 'schedule')}
                  onEdit={() => handleEditCoach(coach)}
                  onDelete={() => handleDeleteCoach(coach)}
                  onToggleStatus={() => handleStatusToggle(coach)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="mt-6">
          <ScheduledClasses
            sessions={sessions}
            coaches={coaches}
            canManage={canManage}
            onAddSession={() => setShowAddSessionDialog(true)}
          />
        </TabsContent>

        {/* Training Levels Tab */}
        <TabsContent value="levels" className="mt-6">
          <TrainingLevels />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <RegisterCoachDialog
        open={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
        onSuccess={handleCoachCreated}
        venueId={venueId}
      />

      {selectedCoach && (
        <>
          <CoachProfileDialog
            open={showProfileDialog}
            onClose={() => { setShowProfileDialog(false); setSelectedCoach(null); }}
            coach={selectedCoach}
            sessions={sessions.filter((s) => s.coachId === selectedCoach.id)}
            defaultTab={profileTab}
          />
          <EditCoachDialog
            open={showEditDialog}
            onClose={() => { setShowEditDialog(false); setSelectedCoach(null); }}
            onSuccess={handleCoachUpdated}
            coach={selectedCoach}
          />
          <DeleteCoachDialog
            open={showDeleteDialog}
            onClose={() => { setShowDeleteDialog(false); setSelectedCoach(null); }}
            onConfirm={() => handleCoachDeleted(selectedCoach.id)}
            coachName={selectedCoach.name}
          />
        </>
      )}

      <AddSessionDialog
        open={showAddSessionDialog}
        onClose={() => setShowAddSessionDialog(false)}
        onSuccess={handleSessionCreated}
        coaches={coaches.filter((c) => c.status === 'active')}
        venueId={venueId}
      />
    </div>
  );
}
