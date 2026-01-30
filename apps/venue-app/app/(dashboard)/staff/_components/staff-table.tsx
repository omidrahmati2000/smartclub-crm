'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { faIR, enUS } from 'date-fns/locale';
import { MoreVertical, Pencil, Trash2, Activity, Shield } from 'lucide-react';
import { Card, CardContent } from '@smartclub/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@smartclub/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@smartclub/ui/avatar';
import { Badge } from '@smartclub/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@smartclub/ui/dropdown-menu';
import { Button } from '@smartclub/ui/button';
import type { StaffMember } from '@smartclub/types';
import { StaffStatus, VenueRole } from '@smartclub/types';

interface StaffTableProps {
  staff: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onViewActivity: (staff: StaffMember) => void;
  onViewPermissions: (role: VenueRole) => void;
  canManage: boolean;
}

export function StaffTable({
  staff,
  onEdit,
  onDelete,
  onViewActivity,
  onViewPermissions,
  canManage,
}: StaffTableProps) {
  const t = useTranslations('venue-admin.staff');
  const locale = useLocale();

  const getRoleBadgeVariant = (role: VenueRole): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (role) {
      case VenueRole.OWNER:
        return 'default'; // Purple/violet
      case VenueRole.MANAGER:
        return 'default'; // Blue (we'll use custom classes)
      case VenueRole.RECEPTIONIST:
        return 'secondary'; // Green
      case VenueRole.CASHIER:
        return 'outline'; // Amber
      default:
        return 'default';
    }
  };

  const getRoleBadgeClass = (role: VenueRole): string => {
    switch (role) {
      case VenueRole.OWNER:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case VenueRole.MANAGER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case VenueRole.RECEPTIONIST:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case VenueRole.CASHIER:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return '';
    }
  };

  const getStatusBadgeClass = (status: StaffStatus): string => {
    switch (status) {
      case StaffStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case StaffStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case StaffStatus.INVITED:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case StaffStatus.SUSPENDED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PP', {
        locale: locale === 'fa' ? faIR : enUS,
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (staff.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">{t('noStaff')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.email')}</TableHead>
                <TableHead>{t('table.phone')}</TableHead>
                <TableHead>{t('table.role')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.hireDate')}</TableHead>
                <TableHead className="text-right rtl:text-left">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell className="text-muted-foreground" dir="ltr">{member.phone}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeClass(member.role)}>
                      {t(`roles.${member.role.toUpperCase()}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(member.status)}>
                      {t(`status.${member.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(member.hireDate)}</TableCell>
                  <TableCell className="text-right rtl:text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewActivity(member)}>
                          <Activity className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                          {t('actions.viewActivity')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewPermissions(member.role)}>
                          <Shield className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                          {t('actions.viewPermissions')}
                        </DropdownMenuItem>
                        {canManage && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(member)}>
                              <Pencil className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                              {t('actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(member)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                              {t('actions.delete')}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
