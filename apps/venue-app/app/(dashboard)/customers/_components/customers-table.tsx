'use client';

import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { faIR, enUS } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@smartclub/ui/table';
import { Badge } from '@smartclub/ui/badge';
import { Button } from '@smartclub/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@smartclub/ui/avatar';
import type { CustomerListItem } from '@smartclub/types';
import { CustomerStatus } from '@smartclub/types';
import { formatCurrency, cn } from '@smartclub/utils';
import { Eye } from 'lucide-react';

interface CustomersTableProps {
  customers: CustomerListItem[];
  onViewProfile: (customerId: string) => void;
}

export function CustomersTable({
  customers,
  onViewProfile,
}: CustomersTableProps) {
  const t = useTranslations('venue-admin.customers');
  const locale = useLocale();

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

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.slice(0, 2);
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

  if (customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">{t('noCustomers')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.name')}</TableHead>
            <TableHead>{t('table.email')}</TableHead>
            <TableHead>{t('table.phone')}</TableHead>
            <TableHead>{t('table.status')}</TableHead>
            <TableHead>{t('table.tags')}</TableHead>
            <TableHead className="text-center">{t('table.totalBookings')}</TableHead>
            <TableHead className="text-start">{t('table.totalSpent')}</TableHead>
            <TableHead>{t('table.lastVisit')}</TableHead>
            <TableHead className="text-start">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{customer.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{customer.email}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {customer.phone}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn('text-xs', getStatusColor(customer.status))}
                >
                  {t(`status.${customer.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: tag.color,
                        color: tag.color,
                      }}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                  {customer.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{customer.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">
                {customer.totalBookings}
              </TableCell>
              <TableCell className="text-start font-medium">
                {formatCurrency(customer.totalSpent, customer.currency, locale as 'fa' | 'en')}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(customer.lastVisit)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewProfile(customer.id)}
                  title={t('actions.viewProfile')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
