import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  type?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Component({
  name = '',
  type = 'text',
  required = false,
  onChange,
  className = '',
  ...props
}: CustomInputProps) {
  return (
    <Input
      name={name}
      type={type}
      required={required}
      onChange={onChange}
      className={cn('w-full', className)}
      {...props}
    />
  );
}
