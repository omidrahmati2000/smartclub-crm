'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import { Label } from '@smartclub/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { Badge } from '@smartclub/ui/badge';
import { Alert, AlertDescription } from '@smartclub/ui/alert';
import { CustomerStatus } from '@smartclub/types';
import { cn } from '@smartclub/utils';
import { AlertTriangle } from 'lucide-react';

interface ChangeStatusDialogProps {
  open: boolean;
  onClose: () => void;
  currentStatus: CustomerStatus;
  onSubmit: (status: CustomerStatus) => Promise<void>;
}

export function ChangeStatusDialog({
  open,
  onClose,
  currentStatus,
  onSubmit,
}: ChangeStatusDialogProps) {
  const t = useTranslations('venue-admin.customers');
  const tc = useTranslations('venue-admin.common');
  const [newStatus, setNewStatus] = useState<CustomerStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'bg-blue-100 text-blue-800';
      case CustomerStatus.VIP:
        return 'bg-amber-100 text-amber-800';
      case CustomerStatus.REGULAR:
        return 'bg-green-100 text-green-800';
      case CustomerStatus.NEW:
        return 'bg-sky-100 text-sky-800';
      case CustomerStatus.BLACKLISTED:
        return 'bg-red-100 text-red-800';
      case CustomerStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async () => {
    if (newStatus === currentStatus) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(newStatus);
    } catch (error) {
      console.error('Failed to change status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewStatus(currentStatus);
    onClose();
  };

  const showBlacklistWarning = newStatus === CustomerStatus.BLACKLISTED;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('statusChange.title')}</DialogTitle>
          <DialogDescription>
            {t('statusChange.confirm')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Status */}
          <div className="space-y-2">
            <Label>{t('statusChange.currentStatus')}</Label>
            <div>
              <Badge
                variant="secondary"
                className={cn('text-sm', getStatusColor(currentStatus))}
              >
                {t(`status.${currentStatus}`)}
              </Badge>
            </div>
          </div>

          {/* New Status */}
          <div className="space-y-2">
            <Label htmlFor="new-status">{t('statusChange.newStatus')}</Label>
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as CustomerStatus)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="new-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CustomerStatus.ACTIVE}>
                  {t('status.ACTIVE')}
                </SelectItem>
                <SelectItem value={CustomerStatus.VIP}>
                  {t('status.VIP')}
                </SelectItem>
                <SelectItem value={CustomerStatus.REGULAR}>
                  {t('status.REGULAR')}
                </SelectItem>
                <SelectItem value={CustomerStatus.NEW}>
                  {t('status.NEW')}
                </SelectItem>
                <SelectItem value={CustomerStatus.INACTIVE}>
                  {t('status.INACTIVE')}
                </SelectItem>
                <SelectItem value={CustomerStatus.BLACKLISTED}>
                  {t('status.BLACKLISTED')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Blacklist Warning */}
          {showBlacklistWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('statusChange.blacklistWarning')}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {tc('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={newStatus === currentStatus || isSubmitting}
            variant={showBlacklistWarning ? 'destructive' : 'default'}
          >
            {isSubmitting ? tc('loading') : tc('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
