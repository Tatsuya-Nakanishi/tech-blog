"use client";

import Link from "next/link";
import InputText from "@/components/common/InputText";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks";
import PrimaryButton from "@/components/common/PrimaryButton";

export default function Component() {
  const { email, password, error, setEmail, setPassword, handleSubmit } =
    useLogin();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <InputText
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <InputText
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <PrimaryButton type="submit" className="w-full bg-purple-600">
              ログイン
            </PrimaryButton>
          </form>
          <div className="mt-3 text-center">
            <Link
              href="/reset_password/send_email"
              className="text-sm text-purple-600 hover:underline"
            >
              パスワードを忘れた方はこちら
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
