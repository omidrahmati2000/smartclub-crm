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

export interface StateOption {
  code: string;
  name: string;
  nameLocal?: string;
}

export interface StateSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  states: StateOption[];
  placeholder?: string;
  disabled?: boolean;
  stateLabel?: string;
  className?: string;
  emptyMessage?: string;
}

export function StateSelector({
  value,
  onChange,
  states,
  placeholder = 'Select state/province',
  disabled = false,
  stateLabel = 'State/Province',
  className,
  emptyMessage = 'No states available',
}: StateSelectorProps) {
  // Get selected state display
  const selectedState = states.find((s) => s.code === value);

  if (states.length === 0) {
    return (
      <div
        className={cn(
          'flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground',
          className
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder}>
          {selectedState && (
            <span className="flex items-center gap-2">
              <span>{selectedState.name}</span>
              {selectedState.nameLocal && selectedState.nameLocal !== selectedState.name && (
                <span className="text-muted-foreground text-xs">
                  ({selectedState.nameLocal})
                </span>
              )}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[250px]">
          <SelectGroup>
            {states.map((state) => (
              <SelectItem key={state.code} value={state.code}>
                <span className="flex items-center gap-2">
                  <span>{state.name}</span>
                  {state.nameLocal && state.nameLocal !== state.name && (
                    <span className="text-muted-foreground text-xs">
                      ({state.nameLocal})
                    </span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
