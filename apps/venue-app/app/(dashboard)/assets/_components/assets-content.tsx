'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@smartclub/ui/button';
import type { Asset, CreateAssetDTO } from '@smartclub/types';
import { AssetCard } from './asset-card';
import { AssetFormDialog } from './asset-form-dialog';

interface AssetsContentProps {
  venueId: string;
  canManage: boolean;
}

export function AssetsContent({ venueId, canManage }: AssetsContentProps) {
  const t = useTranslations('venue-admin.assets');
  const tc = useTranslations('venue-admin.common');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Fetch assets
  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/assets`);
      const data = await response.json();
      if (data.success) {
        setAssets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAssets();
  }, [venueId]);

  // Handle create/edit submit
  const handleSubmit = async (data: CreateAssetDTO) => {
    try {
      if (editingAsset) {
        // Update existing asset
        const response = await fetch(`/api/assets/${editingAsset.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          setAssets((prev) =>
            prev.map((a) => (a.id === editingAsset.id ? result.data : a))
          );
        }
      } else {
        // Create new asset
        const response = await fetch(`/api/venues/${venueId}/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          setAssets((prev) => [...prev, result.data]);
        }
      }
    } catch (error) {
      console.error('Failed to save asset:', error);
      throw error;
    }
  };

  // Handle delete
  const handleDelete = async (assetId: string) => {
    if (!confirm(tc('confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setAssets((prev) => prev.filter((a) => a.id !== assetId));
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (assetId: string) => {
    try {
      const response = await fetch(`/api/assets/${assetId}/status`, {
        method: 'PATCH',
      });
      const result = await response.json();
      if (result.success) {
        setAssets((prev) =>
          prev.map((a) => (a.id === assetId ? result.data : a))
        );
      }
    } catch (error) {
      console.error('Failed to toggle asset status:', error);
    }
  };

  // Handle edit
  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  // Handle create new
  const handleCreateNew = () => {
    setEditingAsset(null);
    setIsFormOpen(true);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setIsFormOpen(false);
    setEditingAsset(null);
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
          <Button onClick={handleCreateNew}>
            <Plus className="me-2 h-4 w-4" />
            {t('createAsset')}
          </Button>
        )}
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">{t('noAssets')}</p>
          {canManage && (
            <Button onClick={handleCreateNew}>
              <Plus className="me-2 h-4 w-4" />
              {t('createFirstAsset')}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              canEdit={canManage}
              canDelete={canManage}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <AssetFormDialog
        open={isFormOpen}
        onClose={handleCloseDialog}
        asset={editingAsset}
        onSubmit={handleSubmit}
        venueId={venueId}
      />
    </div>
  );
}
