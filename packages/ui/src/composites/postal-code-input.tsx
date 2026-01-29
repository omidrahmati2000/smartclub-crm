'use client';

import * as React from 'react';
import { cn } from '../utils';
import { Input, type InputProps } from '../primitives/input';
import { CheckCircle, XCircle } from 'lucide-react';

export interface PostalCodeConfig {
  pattern: RegExp;
  example: string;
  label: string;
  required: boolean;
}

export interface PostalCodeInputProps extends Omit<InputProps, 'onChange'> {
  value?: string;
  onChange: (value: string) => void;
  config?: PostalCodeConfig;
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export function PostalCodeInput({
  value = '',
  onChange,
  config,
  showValidation = true,
  onValidationChange,
  placeholder,
  className,
  disabled,
  ...props
}: PostalCodeInputProps) {
  const [isValid, setIsValid] = React.useState<boolean | null>(null);

  // Validate postal code
  React.useEffect(() => {
    if (!value || !config) {
      setIsValid(null);
      onValidationChange?.(true); // Empty is valid if not required
      return;
    }

    const valid = config.pattern.test(value);
    setIsValid(valid);
    onValidationChange?.(valid || (!config.required && !value));
  }, [value, config, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Determine placeholder
  const displayPlaceholder =
    placeholder || (config?.example ? `e.g., ${config.example}` : 'Postal code');

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleChange}
        placeholder={displayPlaceholder}
        disabled={disabled}
        className={cn(
          showValidation && isValid !== null && 'pe-10',
          isValid === false && 'border-destructive focus-visible:ring-destructive',
          isValid === true && 'border-green-500 focus-visible:ring-green-500',
          className
        )}
        {...props}
      />
      {showValidation && isValid !== null && value && (
        <div className="absolute end-3 top-1/2 -translate-y-1/2">
          {isValid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      )}
      {showValidation && isValid === false && config?.example && (
        <p className="mt-1 text-xs text-destructive">
          Invalid format. Example: {config.example}
        </p>
      )}
    </div>
  );
}
