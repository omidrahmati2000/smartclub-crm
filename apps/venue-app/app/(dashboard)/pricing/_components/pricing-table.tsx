'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@smartclub/ui/table';
import { Button } from '@smartclub/ui/button';
import { Badge } from '@smartclub/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@smartclub/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Eye, Power } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PricingRule, PricingRuleStatus } from '@smartclub/types';
import { RuleTypeBadge } from './rule-type-badge';
import { AdjustmentDisplay } from './adjustment-display';
import { format } from 'date-fns';

interface PricingTableProps {
  rules: PricingRule[];
  canManage: boolean;
  onEdit: (rule: PricingRule) => void;
  onDelete: (rule: PricingRule) => void;
  onToggle: (rule: PricingRule) => void;
  onPreview: (rule: PricingRule) => void;
}

export function PricingTable({
  rules,
  canManage,
  onEdit,
  onDelete,
  onToggle,
  onPreview,
}: PricingTableProps) {
  const t = useTranslations('venue-admin.pricing');

  const getStatusBadge = (status: PricingRuleStatus) => {
    const statusColors = {
      [PricingRuleStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [PricingRuleStatus.INACTIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      [PricingRuleStatus.SCHEDULED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [PricingRuleStatus.EXPIRED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
      <Badge variant="outline" className={statusColors[status]}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const formatValidPeriod = (rule: PricingRule) => {
    const from = format(new Date(rule.validFrom), 'yyyy/MM/dd');
    const until = rule.validUntil ? format(new Date(rule.validUntil), 'yyyy/MM/dd') : '∞';
    return `${from} - ${until}`;
  };

  if (rules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground">{t('noPricingRules')}</p>
        {canManage && (
          <p className="mt-2 text-sm text-muted-foreground">{t('createFirstRule')}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.name')}</TableHead>
            <TableHead>{t('table.type')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead>{t('table.priority')}</TableHead>
            <TableHead>{t('table.adjustment')}</TableHead>
            <TableHead>{t('table.validPeriod')}</TableHead>
            {canManage && <TableHead className="w-[70px]">{t('table.actions')}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{rule.name}</span>
                  {rule.description && (
                    <span className="text-xs text-muted-foreground">{rule.description}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <RuleTypeBadge type={rule.type} />
              </TableCell>
              <TableCell>{getStatusBadge(rule.status)}</TableCell>
              <TableCell>{rule.priority}</TableCell>
              <TableCell>
                <AdjustmentDisplay adjustment={rule.adjustment} />
              </TableCell>
              <TableCell className="text-sm">{formatValidPeriod(rule)}</TableCell>
              {canManage && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">{t('table.actions')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPreview(rule)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t('actions.preview')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggle(rule)}>
                        <Power className="mr-2 h-4 w-4" />
                        {rule.status === PricingRuleStatus.ACTIVE
                          ? t('actions.deactivate')
                          : t('actions.activate')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(rule)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('actions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(rule)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('actions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
