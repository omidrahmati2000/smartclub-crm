'use client';

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
import { useTranslations } from 'next-intl';
import { PricingRule } from '@smartclub/types';

interface DeletePricingRuleDialogProps {
  rule: PricingRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePricingRuleDialog({
  rule,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeletePricingRuleDialogProps) {
  const t = useTranslations('venue-admin.pricing');

  if (!rule) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteRule')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('actions.confirmDelete')}
            <br />
            <strong className="mt-2 block">{rule.name}</strong>
            <br />
            {t('actions.deleteWarning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('form.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? t('form.deleting') : t('actions.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
