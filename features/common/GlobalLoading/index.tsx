'use client';

import React from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import LoadingUI from '@/app/loading';

export default function Component() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return <LoadingUI />;
}
