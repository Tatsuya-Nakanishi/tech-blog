'use client';

import { useState, useEffect } from 'react';

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
