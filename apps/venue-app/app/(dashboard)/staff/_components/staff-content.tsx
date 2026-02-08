'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { usePagination } from '@smartclub/ui/use-pagination';
import { TablePagination } from '@smartclub/ui/table-pagination';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { Button } from '@smartclub/ui/button';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { StaffMember, StaffActivity, RolePermissions } from '@smartclub/types';
import { StaffStatus, VenueRole, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { StaffFilters } from './staff-filters';
import { StaffTable } from './staff-table';
import { AddStaffDialog } from './add-staff-dialog';
import { EditStaffDialog } from './edit-staff-dialog';
import { DeleteStaffDialog } from './delete-staff-dialog';
import { StaffActivityDialog } from './staff-activity-dialog';
import { RolePermissionsDialog } from './role-permissions-dialog';
import { apiClient } from '@/lib/api-client';

export function StaffContent() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('venue-admin.staff');
  const tc = useTranslations('common');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<VenueRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StaffStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'hireDate'>('name');

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activityStaff, setActivityStaff] = useState<{ staff: StaffMember; activities: StaffActivity[] } | null>(null);
  const [permissionsRole, setPermissionsRole] = useState<RolePermissions | null>(null);

  const user = session?.user as any;
  const canView = user && (
    hasPermission(user, Permission.STAFF_VIEW) ||
    hasPermission(user, Permission.STAFF_MANAGE)
  );
  const canManage = user && hasPermission(user, Permission.STAFF_MANAGE);

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchStaff(session.user.venueId);
    }
  }, [session]);

  const fetchStaff = async (venueId: string) => {
    setIsLoading(true);
    try {
      const result = await apiClient.get(`/venues/${venueId}/staff`);
      if (result.success && result.data) {
        setStaff(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort staff
  const filteredStaff = useMemo(() => {
    let filtered = staff.filter((member) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = member.name.toLowerCase().includes(query);
        const matchesEmail = member.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) {
          return false;
        }
      }

      // Role filter
      if (roleFilter !== 'all' && member.role !== roleFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && member.status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, locale === 'fa' ? 'fa' : 'en');
        case 'role':
          return a.role.localeCompare(b.role);
        case 'hireDate':
          return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [staff, searchQuery, roleFilter, statusFilter, sortBy, locale]);

  const {
    paginatedData: paginatedStaff,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = usePagination(filteredStaff);

  const paginationLabels = {
    showing: tc('pagination.showing'),
    of: tc('pagination.of'),
    results: tc('pagination.results'),
    rowsPerPage: tc('pagination.rowsPerPage'),
    page: tc('pagination.page'),
    goToFirst: tc('pagination.goToFirst'),
    goToPrevious: tc('pagination.goToPrevious'),
    goToNext: tc('pagination.goToNext'),
    goToLast: tc('pagination.goToLast'),
  };

  const handleEdit = (member: StaffMember) => {
    setSelectedStaff(member);
    setShowEditDialog(true);
  };

  const handleDelete = (member: StaffMember) => {
    setSelectedStaff(member);
    setShowDeleteDialog(true);
  };

  const handleViewActivity = async (member: StaffMember) => {
    try {
      const result = await apiClient.get(`/staff/${member.id}/activity`);
      if (result.success && result.data) {
        setActivityStaff({ staff: member, activities: result.data });
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  };

  const handleViewPermissions = async (role: VenueRole) => {
    try {
      const result = await apiClient.get(`/roles/${role}/permissions`);
      if (result.success && result.data) {
        setPermissionsRole(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  };

  const handleStaffCreated = (newStaff: StaffMember) => {
    setStaff(prev => [...prev, newStaff]);
    setShowAddDialog(false);
  };

  const handleStaffUpdated = (updatedStaff: StaffMember) => {
    setStaff(prev => prev.map(member =>
      member.id === updatedStaff.id ? updatedStaff : member
    ));
    setShowEditDialog(false);
    setSelectedStaff(null);
  };

  const handleStaffDeleted = (staffId: string) => {
    setStaff(prev => prev.filter(member => member.id !== staffId));
    setShowDeleteDialog(false);
    setSelectedStaff(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12" />
        <Skeleton className="h-16" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
{t('noPermission')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('showingResults', { count: totalItems })}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('addStaff')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        </CardContent>
      </Card>

      {/* Staff Table */}
      <StaffTable
        staff={paginatedStaff}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewActivity={handleViewActivity}
        onViewPermissions={handleViewPermissions}
        canManage={canManage}
      />

      {/* Pagination */}
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        labels={paginationLabels}
      />

      {/* Dialogs */}
      <AddStaffDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={handleStaffCreated}
        venueId={session?.user?.venueId || ''}
      />

      {selectedStaff && (
        <>
          <EditStaffDialog
            open={showEditDialog}
            onClose={() => {
              setShowEditDialog(false);
              setSelectedStaff(null);
            }}
            onSuccess={handleStaffUpdated}
            staff={selectedStaff}
          />

          <DeleteStaffDialog
            open={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false);
              setSelectedStaff(null);
            }}
            onSuccess={handleStaffDeleted}
            staff={selectedStaff}
          />
        </>
      )}

      {activityStaff && (
        <StaffActivityDialog
          open={!!activityStaff}
          onClose={() => setActivityStaff(null)}
          staff={activityStaff.staff}
          activities={activityStaff.activities}
        />
      )}

      {permissionsRole && (
        <RolePermissionsDialog
          open={!!permissionsRole}
          onClose={() => setPermissionsRole(null)}
          rolePermissions={permissionsRole}
        />
      )}
    </div>
  );
}
