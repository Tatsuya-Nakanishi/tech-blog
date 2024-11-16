"use client";

import Link from "next/link";
import InputText from "@/components/common/InputText";
import { Label } from "@/components/ui/label";
import { signupAction } from "../actions/signup";
import { useFormState } from 'react-dom';
import PrimaryButton from "@/components/common/PrimaryButton";

const initialState = {
  error: '',
};

export default function Component() {
  const [state, formAction] = useFormState(signupAction, initialState);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">サインアップ</h1>
          <form className="mt-8 space-y-6" action={formAction}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required={true}
                />
              </div>
              <div>
                <Label htmlFor="password">パスワード</Label>
                <InputText
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required={true}
                />
              </div>
            </div>
            {state && state.error && (
              <div className="text-red-500 text-sm text-center">{state.error}</div>
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
