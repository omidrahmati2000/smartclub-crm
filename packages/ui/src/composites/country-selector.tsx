'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '../utils';
import { Button } from '../primitives/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../primitives/select';
import { Input } from '../primitives/input';
import { ScrollArea } from '../primitives/scroll-area';

export interface CountryOption {
  code: string;
  name: string;
  nameLocal?: string;
  flag: string;
  region: string;
}

export interface CountrySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  countries: CountryOption[];
  placeholder?: string;
  disabled?: boolean;
  showFlags?: boolean;
  groupByRegion?: boolean;
  searchable?: boolean;
  className?: string;
  regionLabels?: Record<string, string>;
}

export function CountrySelector({
  value,
  onChange,
  countries,
  placeholder = 'Select country',
  disabled = false,
  showFlags = true,
  groupByRegion = true,
  searchable = true,
  className,
  regionLabels = {
    middle_east: 'Middle East',
    europe: 'Europe',
    americas: 'Americas',
    asia_pacific: 'Asia Pacific',
    africa: 'Africa',
  },
}: CountrySelectorProps) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // Filter countries by search term
  const filteredCountries = React.useMemo(() => {
    if (!search) return countries;
    const searchLower = search.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchLower) ||
        country.nameLocal?.toLowerCase().includes(searchLower) ||
        country.code.toLowerCase().includes(searchLower)
    );
  }, [countries, search]);

  // Group countries by region
  const groupedCountries = React.useMemo(() => {
    if (!groupByRegion) return { all: filteredCountries };

    return filteredCountries.reduce(
      (acc, country) => {
        const region = country.region || 'other';
        if (!acc[region]) acc[region] = [];
        acc[region].push(country);
        return acc;
      },
      {} as Record<string, CountryOption[]>
    );
  }, [filteredCountries, groupByRegion]);

  // Get selected country display
  const selectedCountry = countries.find((c) => c.code === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder}>
          {selectedCountry && (
            <span className="flex items-center gap-2">
              {showFlags && <span>{selectedCountry.flag}</span>}
              <span>{selectedCountry.name}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {searchable && (
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-8 h-9"
              />
            </div>
          </div>
        )}
        <ScrollArea className="h-[300px]">
          {groupByRegion ? (
            Object.entries(groupedCountries).map(([region, regionCountries]) => (
              <SelectGroup key={region}>
                <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                  {regionLabels[region] || region}
                </SelectLabel>
                {regionCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      {showFlags && <span>{country.flag}</span>}
                      <span>{country.name}</span>
                      {country.nameLocal && country.nameLocal !== country.name && (
                        <span className="text-muted-foreground text-xs">
                          ({country.nameLocal})
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          ) : (
            <SelectGroup>
              {filteredCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-2">
                    {showFlags && <span>{country.flag}</span>}
                    <span>{country.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {filteredCountries.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No countries found
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
