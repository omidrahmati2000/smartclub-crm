'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@smartclub/ui/button';
import type {
  PricingRule,
  CreatePricingRuleDTO,
  UpdatePricingRuleDTO,
  Asset,
  PricingRuleStatus,
} from '@smartclub/types';
import { PricingTable } from './pricing-table';
import { PricingFilters } from './pricing-filters';
import { AddPricingRuleDialog } from './add-pricing-rule-dialog';
import { EditPricingRuleDialog } from './edit-pricing-rule-dialog';
import { DeletePricingRuleDialog } from './delete-pricing-rule-dialog';
import { PricePreviewDialog } from './price-preview-dialog';

interface PricingContentProps {
  venueId: string;
  canManage: boolean;
}

export function PricingContent({ venueId, canManage }: PricingContentProps) {
  const t = useTranslations('venue-admin.pricing');
  const tc = useTranslations('venue-admin.common');
  

  const [rules, setRules] = useState<PricingRule[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch pricing rules
  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/pricing-rules`);
      const data = await response.json();
      if (data.success) {
        setRules(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pricing rules:', error);
      console.log({
        title: tc('error'),
        description: 'Failed to load pricing rules',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch assets for targeting
  const fetchAssets = async () => {
    try {
      const response = await fetch(`/api/venues/${venueId}/assets`);
      const data = await response.json();
      if (data.success) {
        setAssets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRules();
    fetchAssets();
  }, [venueId]);

  // Filter rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      // Search filter
      if (search && !rule.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && rule.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && rule.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [rules, search, typeFilter, statusFilter]);

  // Handle create rule
  const handleCreateRule = async (data: CreatePricingRuleDTO) => {
    try {
      const response = await fetch(`/api/venues/${venueId}/pricing-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        setRules((prev) => [...prev, result.data]);
        console.log({
          title: tc('success'),
          description: t('form.created'),
        });
      }
    } catch (error) {
      console.error('Failed to create pricing rule:', error);
      console.log({
        title: tc('error'),
        description: 'Failed to create pricing rule',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Handle update rule
  const handleUpdateRule = async (id: string, data: UpdatePricingRuleDTO) => {
    try {
      const response = await fetch(`/api/pricing-rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        setRules((prev) => prev.map((rule) => (rule.id === id ? result.data : rule)));
        console.log({
          title: tc('success'),
          description: t('form.updated'),
        });
      }
    } catch (error) {
      console.error('Failed to update pricing rule:', error);
      console.log({
        title: tc('error'),
        description: 'Failed to update pricing rule',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Handle delete rule
  const handleDeleteRule = async () => {
    if (!selectedRule) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/pricing-rules/${selectedRule.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        setRules((prev) => prev.filter((rule) => rule.id !== selectedRule.id));
        console.log({
          title: tc('success'),
          description: t('form.deleted'),
        });
        setIsDeleteDialogOpen(false);
        setSelectedRule(null);
      }
    } catch (error) {
      console.error('Failed to delete pricing rule:', error);
      console.log({
        title: tc('error'),
        description: 'Failed to delete pricing rule',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle toggle rule status
  const handleToggleRule = async (rule: PricingRule) => {
    try {
      const newStatus =
        rule.status === PricingRuleStatus.ACTIVE
          ? PricingRuleStatus.INACTIVE
          : PricingRuleStatus.ACTIVE;

      const response = await fetch(`/api/pricing-rules/${rule.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();

      if (result.success) {
        setRules((prev) => prev.map((r) => (r.id === rule.id ? result.data : r)));
        console.log({
          title: tc('success'),
          description:
            newStatus === PricingRuleStatus.ACTIVE ? t('form.activated') : t('form.deactivated'),
        });
      }
    } catch (error) {
      console.error('Failed to toggle pricing rule:', error);
      console.log({
        title: tc('error'),
        description: 'Failed to toggle pricing rule',
        variant: 'destructive',
      });
    }
  };

  // Handle edit action
  const handleEdit = (rule: PricingRule) => {
    setSelectedRule(rule);
    setIsEditDialogOpen(true);
  };

  // Handle delete action
  const handleDeleteClick = (rule: PricingRule) => {
    setSelectedRule(rule);
    setIsDeleteDialogOpen(true);
  };

  // Handle preview action
  const handlePreview = (rule: PricingRule) => {
    setSelectedRule(rule);
    setIsPreviewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{tc('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('description')}</p>
        </div>
        {canManage && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addRule')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <PricingFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Results count */}
      {filteredRules.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {t('showingResults', { count: filteredRules.length })}
        </p>
      )}

      {/* Table */}
      <PricingTable
        rules={filteredRules}
        canManage={canManage}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggle={handleToggleRule}
        onPreview={handlePreview}
      />

      {/* Dialogs */}
      <AddPricingRuleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleCreateRule}
        assets={assets}
      />

      <EditPricingRuleDialog
        rule={selectedRule}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateRule}
        assets={assets}
      />

      <DeletePricingRuleDialog
        rule={selectedRule}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRule}
        isDeleting={isDeleting}
      />

      <PricePreviewDialog
        rule={selectedRule}
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
      />
    </div>
  );
}
