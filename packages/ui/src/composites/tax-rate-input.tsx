'use client';

import * as React from 'react';
import { cn } from '../utils';
import { Input, type InputProps } from '../primitives/input';
import { Percent } from 'lucide-react';

export interface TaxRateInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number;
  showIcon?: boolean;
}

export function TaxRateInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 0.5,
  decimalPlaces = 2,
  showIcon = true,
  placeholder = '0.00',
  className,
  disabled,
  ...props
}: TaxRateInputProps) {
  const [inputValue, setInputValue] = React.useState(
    value !== undefined ? value.toFixed(decimalPlaces) : ''
  );

  // Sync input value with external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value.toFixed(decimalPlaces));
    }
  }, [value, decimalPlaces]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Allow empty input
    if (rawValue === '') {
      setInputValue('');
      onChange(0);
      return;
    }

    // Only allow valid number characters
    if (!/^[\d.]*$/.test(rawValue)) return;

    // Prevent multiple decimal points
    if ((rawValue.match(/\./g) || []).length > 1) return;

    setInputValue(rawValue);

    // Parse and validate
    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onChange(clampedValue);
    }
  };

  const handleBlur = () => {
    // Format on blur
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      setInputValue('0.00');
      onChange(0);
    } else {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      setInputValue(clampedValue.toFixed(decimalPlaces));
      onChange(clampedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Increment/decrement with arrow keys
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentValue = parseFloat(inputValue) || 0;
      const newValue =
        e.key === 'ArrowUp'
          ? Math.min(currentValue + step, max)
          : Math.max(currentValue - step, min);
      setInputValue(newValue.toFixed(decimalPlaces));
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(showIcon && 'pe-10', className)}
        inputMode="decimal"
        {...props}
      />
      {showIcon && (
        <div className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Percent className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
