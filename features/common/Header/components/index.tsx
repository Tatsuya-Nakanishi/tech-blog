'use client';

import Link from 'next/link';
import { User as UserIcon, LogOut, Menu } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { useMenu } from '../hooks/useMenu';
import { useUser } from '../hooks/useUser';
import { UserType } from '@/types/user';

type PropType = {
  user: UserType | null;
};

export default function Header({ user }: PropType) {
  const { isMenuOpen, toggleMenu, setIsMenuOpen, setMenuElement } = useMenu();
  const { handleLogout } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-purple-800 text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/top" className="text-2xl font-bold">
          TATSULOG
        </Link>
        <nav className="hidden items-center space-x-4 md:flex">
          {user ? (
            <>
              <Link href="/identity/mypage" className="hover:underline">
                マイページ
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                ログアウト
              </button>
              <Avatar className="h-8 w-8" src={user.avatar_url || ''} alt={'icon'} />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                ログイン
              </Link>
              <Link href="/signup" className="hover:underline">
                新規登録
              </Link>
            </>
          )}
        </nav>
        <div className="relative md:hidden" ref={setMenuElement}>
          <button
            className="p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {user ? (
              <Avatar className="h-8 w-8" src={user.avatar_url || ''} alt={'icon'} />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
              {user ? (
                <>
                  <Link
                    href="/identity/mypage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="mr-2 inline-block h-4 w-4" />
                    マイページ
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-100"
                  >
                    <LogOut className="mr-2 inline-block h-4 w-4" />
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    <UserIcon className="mr-2 inline-block h-4 w-4" />
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="mr-2 inline-block h-4 w-4" />
                    新規登録
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
