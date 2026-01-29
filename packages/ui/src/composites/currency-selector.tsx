'use client';

import * as React from 'react';
import { cn } from '../utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select';
import { ScrollArea } from '../primitives/scroll-area';

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  symbolNative?: string;
}

export interface CurrencySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  currencies: CurrencyOption[];
  placeholder?: string;
  disabled?: boolean;
  showSymbol?: boolean;
  className?: string;
}

export function CurrencySelector({
  value,
  onChange,
  currencies,
  placeholder = 'Select currency',
  disabled = false,
  showSymbol = true,
  className,
}: CurrencySelectorProps) {
  // Get selected currency display
  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder}>
          {selectedCurrency && (
            <span className="flex items-center gap-2">
              {showSymbol && (
                <span className="text-muted-foreground">
                  {selectedCurrency.symbolNative || selectedCurrency.symbol}
                </span>
              )}
              <span>{selectedCurrency.code}</span>
              <span className="text-muted-foreground text-xs">
                - {selectedCurrency.name}
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[250px]">
          <SelectGroup>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <span className="flex items-center gap-2">
                  {showSymbol && (
                    <span className="text-muted-foreground w-8">
                      {currency.symbolNative || currency.symbol}
                    </span>
                  )}
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-muted-foreground text-xs">
                    {currency.name}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
