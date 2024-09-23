"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "../hooks";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function Component() {
  const { email, setEmail, password, setPassword, error, handleSubmit } =
    useSignup();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">サインアップ</h1>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* <div>
                <Label htmlFor="nickname">ニックネーム</Label>
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div> */}
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <PrimaryButton type="submit">サインアップ</PrimaryButton>
            </div>
          </form>
          <div className="text-sm text-center mt-3">
            <p>アカウントをお持ちですか？</p>
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              ログインはこちら
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
