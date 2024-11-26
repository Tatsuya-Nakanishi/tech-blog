// hooks.ts
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client/browserClient';
import { useRouter } from 'next/navigation';

// メニューの開閉と外部クリックを管理するカスタムフック
export function useMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuElement, setMenuElement] = useState<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuElement && !menuElement.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuElement]);

  return { isMenuOpen, toggleMenu, setIsMenuOpen, setMenuElement };
}

// ユーザーのログイン状態を管理するカスタムフック
export function useUser() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return { handleLogin, handleLogout };
}
