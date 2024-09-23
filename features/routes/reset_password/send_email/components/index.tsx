"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "../hooks";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function Component() {
  const { email, setEmail, error, success, handleSubmit } = useResetPassword();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            パスワードリセット
          </h1>
          {!success ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <PrimaryButton type="submit">メールを送信</PrimaryButton>
              </div>
            </form>
          ) : (
            <div className="mt-8 text-center text-green-600">
              パスワードリセットメールを送信しました。メールをご確認ください。
            </div>
          )}
          <div className="text-sm text-center mt-3">
            <Link
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              ログインページに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
