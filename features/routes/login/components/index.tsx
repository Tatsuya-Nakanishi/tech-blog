"use client";

import InputText from "@/components/common/InputText";
import { Label } from "@/components/ui/label";
import { loginAction } from "../actions/login";
import { useActionState } from 'react';
import PrimaryButton from "@/components/common/PrimaryButton";

const initialState = {
  error: '',
};

export default function Component() {
  const [state, formAction,] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <InputText
                type="email"
                id="email"
                name="email"
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <InputText
                type="password"
                id="password"
                name="password"
                required
                className="w-full"
              />
            </div>
            {state && state.error && <p className="text-red-500 text-sm">{state.error}</p>}
            <PrimaryButton type="submit" className="w-full bg-purple-600">
              ログイン
            </PrimaryButton>
          </form>
        </div>
      </main>
    </div>
  );
}
