import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CustomAvatarProps {
  className?: string;
  src: string;
  alt: string;
  fallback?: string;
}

export default function CustomAvatar({
  className = 'rounded-full mr-4 w-16 h-16',
  src,
  alt,
  fallback = 'UN',
}: CustomAvatarProps) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
