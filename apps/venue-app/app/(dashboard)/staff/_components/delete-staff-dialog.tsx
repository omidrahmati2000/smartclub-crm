'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@smartclub/ui/alert-dialog';
import { useToast } from '@smartclub/ui/use-toast';
import { Loader2 } from 'lucide-react';
import type { StaffMember } from '@smartclub/types';
import { apiClient } from '@/lib/api-client';

interface DeleteStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (staffId: string) => void;
  staff: StaffMember;
}

export function DeleteStaffDialog({ open, onClose, onSuccess, staff }: DeleteStaffDialogProps) {
  const t = useTranslations('venue-admin.staff');
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await apiClient.delete(`/staff/${staff.id}`);

      if (result.success) {
        toast({
          title: t('form.deleted'),
          variant: 'default',
        });
        onSuccess(staff.id);
      } else {
        throw new Error(result.error || 'Failed to delete staff member');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete staff member',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteStaff')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('actions.confirmDelete')}
            <br />
            <br />
            <strong>{staff.name}</strong> ({staff.email})
            <br />
            <br />
            {t('actions.deleteWarning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t('form.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="h-4 w-4 ltr:mr-2 rtl:ml-2 animate-spin" />}
            {isDeleting ? t('actions.delete') + '...' : t('actions.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
