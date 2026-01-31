'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { Skeleton } from '@smartclub/ui/skeleton';
import type { CustomerListItem, CustomerProfile, CustomerTag } from '@smartclub/types';
import { CustomerStatus, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { CustomerFilters } from './customer-filters';
import { CustomersTable } from './customers-table';
import { CustomerProfileModal } from './customer-profile-modal';
import { apiClient } from '@/lib/api-client';

export function CustomersContent() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('venue-admin.customers');
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [availableTags, setAvailableTags] = useState<CustomerTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'totalBookings' | 'lastVisit'>('name');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const user = session?.user as any;
  const canView = user && (
    hasPermission(user, Permission.CUSTOMER_VIEW) ||
    hasPermission(user, Permission.CUSTOMER_MANAGE)
  );

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchData(session.user.venueId);
    }
  }, [session]);

  const fetchData = async (venueId: string) => {
    setIsLoading(true);
    try {
      // Fetch customers list
      const customersResult = await apiClient.get(`/venues/${venueId}/customers`);
      if (customersResult.success && customersResult.data) {
        setCustomers(customersResult.data);
      }

      // Fetch available tags
      const tagsResult = await apiClient.get(`/venues/${venueId}/customer-tags`);
      if (tagsResult.success && tagsResult.data) {
        setAvailableTags(tagsResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch customers data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = customer.name.toLowerCase().includes(query);
        const matchesEmail = customer.email.toLowerCase().includes(query);
        const matchesPhone = customer.phone.includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && customer.status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, locale === 'fa' ? 'fa' : 'en');
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalBookings':
          return b.totalBookings - a.totalBookings;
        case 'lastVisit':
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, searchQuery, statusFilter, sortBy, locale]);

  const handleViewProfile = async (customerId: string) => {
    try {
      const result = await apiClient.get(`/customers/${customerId}`);
      if (result.success && result.data) {
        setSelectedCustomer(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch customer profile:', error);
    }
  };

  const handleExportCSV = async () => {
    if (!session?.user?.venueId) return;

    try {
      // Note: For blob responses, we still need to use fetch directly
      const response = await fetch(`/api/venues/${session.user.venueId}/customers/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  const handleCustomerUpdate = (updatedCustomer: CustomerProfile) => {
    setSelectedCustomer(updatedCustomer);

    // Update the customer in the list
    setCustomers(prev => prev.map(customer =>
      customer.id === updatedCustomer.id
        ? {
            ...customer,
            status: updatedCustomer.status,
            tags: updatedCustomer.customerTags,
          }
        : customer
    ));
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
        <p className="text-muted-foreground">{t('noPermission')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('showingResults', { count: filteredCustomers.length })}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onExportCSV={handleExportCSV}
          />
        </CardContent>
      </Card>

      {/* Customers Table */}
      <CustomersTable
        customers={filteredCustomers}
        onViewProfile={handleViewProfile}
      />

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <CustomerProfileModal
          customer={selectedCustomer}
          open={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={handleCustomerUpdate}
          availableTags={availableTags}
        />
      )}
    </div>
  );
}
