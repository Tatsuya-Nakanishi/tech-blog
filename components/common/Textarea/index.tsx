import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CustomTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export default function Component({
  value,
  onChange,
  className,
  ...props
}: CustomTextareaProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      className={cn('w-full', className)}
      {...props}
    />
  );
}