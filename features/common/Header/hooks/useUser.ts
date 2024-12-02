'use client';

import { useRouter } from 'next/navigation';
import { logout } from '../actions/logout';

export function useUser() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
    router.refresh();
  };

  return { handleLogout };
}
