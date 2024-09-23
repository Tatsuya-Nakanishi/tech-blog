"use client";

import Link from "next/link";
import { User as UserIcon, LogOut, Menu } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { useMenu, useUser } from "../hooks";
import { UserType } from "@/types/user";

type PropType = {
  user: UserType | null;
};

export default function Header({ user }: PropType) {
  const { isMenuOpen, toggleMenu, setIsMenuOpen, setMenuElement } = useMenu();
  const { handleLogin, handleLogout } = useUser();

  return (
    <header className="bg-purple-800 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/top" className="text-2xl font-bold">
          TATSULOG
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/identity/mypage" className="hover:underline">
                マイページ
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                ログアウト
              </button>
              <Avatar
                className="h-8 w-8"
                src={user.avatar_url || ""}
                alt={"icon"}
              />
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
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {user ? (
              <Avatar
                className="h-8 w-8"
                src={user.avatar_url || ""}
                alt={"icon"}
              />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              {user ? (
                <>
                  <Link
                    href="/identity/mypage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="inline-block w-4 h-4 mr-2" />
                    マイページ
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                  >
                    <UserIcon className="inline-block w-4 h-4 mr-2" />
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="inline-block w-4 h-4 mr-2" />
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
