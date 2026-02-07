import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@smartclub/ui/card';
import { Badge } from '@smartclub/ui/badge';
import { Button } from '@smartclub/ui/button';
import type { Asset } from '@smartclub/types';
import { BookingType } from '@smartclub/types';
import { formatCurrency } from '@smartclub/utils';
import { Edit, Trash2, Power } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  onToggleStatus: (assetId: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function AssetCard({
  asset,
  onEdit,
  onDelete,
  onToggleStatus,
  canEdit,
  canDelete,
}: AssetCardProps) {
  const t = useTranslations('venue-admin.assets');
  const ts = useTranslations('sports');

  const getBookingTypeLabel = (type: BookingType) => {
    switch (type) {
      case BookingType.SLOT_BASED:
        return t('slotBased');
      case BookingType.DURATION_BASED:
        return t('durationBased');
      case BookingType.CAPACITY_BASED:
        return t('capacityBased');
      case BookingType.OPEN_SESSION:
        return t('openSession');
      default:
        return type;
    }
  };

  const getPriceDisplay = () => {
    switch (asset.bookingType) {
      case BookingType.SLOT_BASED:
        return asset.pricePerSlot
          ? `${formatCurrency(asset.pricePerSlot, asset.currency, 'en')} / ${t('pricePerSlot')}`
          : '-';
      case BookingType.DURATION_BASED:
        return asset.pricePerHour
          ? `${formatCurrency(asset.pricePerHour, asset.currency, 'en')} / ${t('pricePerHour')}`
          : '-';
      case BookingType.CAPACITY_BASED:
        return asset.pricePerSession
          ? `${formatCurrency(asset.pricePerSession, asset.currency, 'en')} / ${t('pricePerSession')}`
          : '-';
      case BookingType.OPEN_SESSION:
        return asset.pricePerMinute
          ? `${formatCurrency(asset.pricePerMinute, asset.currency, 'en')} / ${t('pricePerMinute')}`
          : '-';
      default:
        return '-';
    }
  };

  return (
    <Card className={!asset.isActive ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{asset.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {ts(asset.type)}
            </p>
          </div>
          <Badge variant={asset.isActive ? 'default' : 'secondary'}>
            {asset.isActive ? t('active') : t('maintenance')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t('bookingType')}:</span>
            <p className="font-medium">{getBookingTypeLabel(asset.bookingType)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t('pricing')}:</span>
            <p className="font-medium">{getPriceDisplay()}</p>
          </div>
        </div>

        {asset.capacity && (
          <div className="text-sm">
            <span className="text-muted-foreground">{t('capacity')}: </span>
            <span className="font-medium">{asset.capacity}</span>
          </div>
        )}

        {(asset.minDuration || asset.maxDuration) && (
          <div className="text-sm">
            <span className="text-muted-foreground">{t('duration')}: </span>
            <span className="font-medium">
              {asset.minDuration && t('minMinutes', { count: asset.minDuration })}
              {asset.minDuration && asset.maxDuration && ' - '}
              {asset.maxDuration && t('maxMinutes', { count: asset.maxDuration })}
            </span>
          </div>
        )}

        {asset.slotDuration && (
          <div className="text-sm">
            <span className="text-muted-foreground">{t('slotDuration')}: </span>
            <span className="font-medium">{t('minutes', { count: asset.slotDuration })}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(asset.id)}
          className="flex-1"
        >
          <Power className="me-2 h-4 w-4" />
          {asset.isActive ? t('deactivate') : t('activate')}
        </Button>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(asset)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(asset.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
