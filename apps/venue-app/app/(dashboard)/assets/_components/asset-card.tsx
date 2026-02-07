import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@smartclub/ui/card';
import { Badge } from '@smartclub/ui/badge';
import { Button } from '@smartclub/ui/button';
import type { Asset } from '@smartclub/types';
import { BookingType } from '@smartclub/types';
import { formatCurrency } from '@smartclub/utils';
import { Edit, Trash2, Power, Wifi, Car, Droplet, Lock, Wind, Users, Image as ImageIcon, Clock } from 'lucide-react';

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

  const facilityIcons: Record<string, React.ReactNode> = {
    Wifi: <Wifi className="h-3.5 w-3.5" />,
    Car: <Car className="h-3.5 w-3.5" />,
    Droplet: <Droplet className="h-3.5 w-3.5" />,
    Lock: <Lock className="h-3.5 w-3.5" />,
    Wind: <Wind className="h-3.5 w-3.5" />,
    Users: <Users className="h-3.5 w-3.5" />,
  };

  const primaryImage = asset.images?.find((img) => img.order === 0) || asset.images?.[0];

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
    <Card
      className={`overflow-hidden ${!asset.isActive ? 'opacity-60' : ''} ${canEdit ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={() => canEdit && onEdit(asset)}
    >
      {/* Image */}
      {primaryImage ? (
        <div className="relative h-40 w-full bg-muted">
          <img
            src={primaryImage.url}
            alt={asset.name}
            className="h-full w-full object-cover"
          />
          {asset.images && asset.images.length > 1 && (
            <div className="absolute bottom-2 end-2 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs text-white">
              <ImageIcon className="h-3 w-3" />
              {asset.images.length}
            </div>
          )}
          <Badge
            variant={asset.isActive ? 'default' : 'secondary'}
            className="absolute top-2 end-2"
          >
            {asset.isActive ? t('active') : t('maintenance')}
          </Badge>
        </div>
      ) : null}

      <CardHeader className={primaryImage ? 'pt-3' : ''}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{asset.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {ts(asset.type)}
            </p>
          </div>
          {!primaryImage && (
            <Badge variant={asset.isActive ? 'default' : 'secondary'}>
              {asset.isActive ? t('active') : t('maintenance')}
            </Badge>
          )}
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

        {/* Facilities */}
        {asset.facilities && asset.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {asset.facilities
              .filter((f) => f.available)
              .map((facility) => (
                <span
                  key={facility.id}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  title={facility.name}
                >
                  {facilityIcons[facility.icon] || null}
                  {facility.name}
                </span>
              ))}
          </div>
        )}

        {/* Operating Hours indicator */}
        {asset.operatingHours && asset.operatingHours.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{t('operatingHours')}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 flex-wrap justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(asset.id);
          }}
        >
          <Power className="me-1 h-4 w-4" />
          {asset.isActive ? t('deactivate') : t('activate')}
        </Button>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(asset);
            }}
            title={t('edit')}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(asset.id);
            }}
            title={t('deleteAsset')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
