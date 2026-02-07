'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Card } from '@smartclub/ui/card';
import type { AssetFacility } from '@smartclub/types';
import {
  Wifi,
  Car,
  Droplet,
  Lock,
  Wind,
  Coffee,
  ShowerHead,
  Users,
  Clock,
  Shield,
  Accessibility,
  Camera,
} from 'lucide-react';

interface FacilitySelectorProps {
  facilities: AssetFacility[];
  onFacilitiesChange: (facilities: AssetFacility[]) => void;
}

const AVAILABLE_FACILITIES = [
  { id: 'wifi', name: 'WiFi', icon: 'Wifi' },
  { id: 'parking', name: 'Parking', icon: 'Car' },
  { id: 'shower', name: 'Shower', icon: 'Droplet' },
  { id: 'locker', name: 'Locker', icon: 'Lock' },
  { id: 'ac', name: 'Air Conditioning', icon: 'Wind' },
  { id: 'cafe', name: 'Café / Refreshments', icon: 'Coffee' },
  { id: 'changing-room', name: 'Changing Room', icon: 'ShowerHead' },
  { id: 'seating', name: 'Spectator Seating', icon: 'Users' },
  { id: 'timing', name: 'Electronic Timing', icon: 'Clock' },
  { id: 'security', name: '24/7 Security', icon: 'Shield' },
  { id: 'accessible', name: 'Wheelchair Accessible', icon: 'Accessibility' },
  { id: 'cctv', name: 'CCTV', icon: 'Camera' },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wifi,
  Car,
  Droplet,
  Lock,
  Wind,
  Coffee,
  ShowerHead,
  Users,
  Clock,
  Shield,
  Accessibility,
  Camera,
};

export function FacilitySelector({
  facilities,
  onFacilitiesChange,
}: FacilitySelectorProps) {
  const t = useTranslations('venue-admin.assets');

  const toggleFacility = (facilityId: string) => {
    const existing = facilities.find((f) => f.id === facilityId);

    if (existing) {
      // Remove facility
      onFacilitiesChange(facilities.filter((f) => f.id !== facilityId));
    } else {
      // Add facility
      const facilityTemplate = AVAILABLE_FACILITIES.find((f) => f.id === facilityId);
      if (facilityTemplate) {
        onFacilitiesChange([
          ...facilities,
          {
            id: facilityTemplate.id,
            name: facilityTemplate.name,
            icon: facilityTemplate.icon,
            available: true,
          },
        ]);
      }
    }
  };

  const isFacilitySelected = (facilityId: string) => {
    return facilities.some((f) => f.id === facilityId);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {AVAILABLE_FACILITIES.map((facility) => {
        const Icon = ICON_MAP[facility.icon];
        const isSelected = isFacilitySelected(facility.id);

        return (
          <Card
            key={facility.id}
            className={`
              p-4 cursor-pointer transition-all hover:shadow-md
              ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
            `}
            onClick={() => toggleFacility(facility.id)}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                  p-2 rounded-lg
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}
              >
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{facility.name}</p>
              </div>
              {isSelected && (
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
