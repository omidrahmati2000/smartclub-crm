'use client';

import { useTranslations } from 'next-intl';
import { Shield, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { ScrollArea } from '@smartclub/ui/scroll-area';
import { Badge } from '@smartclub/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@smartclub/ui/table';
import type { RolePermissions } from '@smartclub/types';

interface RolePermissionsDialogProps {
  open: boolean;
  onClose: () => void;
  rolePermissions: RolePermissions;
}

export function RolePermissionsDialog({
  open,
  onClose,
  rolePermissions,
}: RolePermissionsDialogProps) {
  const t = useTranslations('venue-admin.staff.permissions');
  const tRoles = useTranslations('venue-admin.staff.roles');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('title')} - {tRoles(rolePermissions.role.toUpperCase())}
          </DialogTitle>
          <DialogDescription>{rolePermissions.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {rolePermissions.permissions.map((category, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{category.category}</Badge>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('permission')}</TableHead>
                        <TableHead className="text-center w-32">{t('enabled')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.items.map((item, itemIdx) => (
                        <TableRow key={itemIdx}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {item.permission}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.enabled ? (
                              <div className="flex items-center justify-center">
                                <div className="flex items-center gap-2 text-green-600">
                                  <Check className="h-5 w-5" />
                                  <span className="text-sm font-medium">{t('enabled')}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <X className="h-5 w-5" />
                                  <span className="text-sm font-medium">{t('disabled')}</span>
                                </div>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
