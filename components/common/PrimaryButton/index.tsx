import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';

interface PrimaryButtonProps extends ButtonProps {
  width?: string;
}

export default function Component({
  width = 'w-full',
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        'group relative flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        width,
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
