"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePasswordResetConfirm } from "../hooks";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function Component() {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    handleSubmit,
  } = usePasswordResetConfirm();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            新しいパスワードの設定
          </h1>
          {!success ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="new-password">新しいパスワード</Label>
                <Input
                  id="new-password"
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">
                  新しいパスワード（確認）
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <PrimaryButton type="submit">パスワードを変更</PrimaryButton>
              </div>
            </form>
          ) : (
            <div className="mt-8 text-center text-green-600">
              パスワードが正常に変更されました。新しいパスワードでログインしてください。
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
