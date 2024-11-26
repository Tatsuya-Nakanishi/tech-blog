'use client';

import InputText from '@/components/common/InputText';
import { Label } from '@/components/ui/label';
import { loginAction } from '../actions/login';
import { useActionState } from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';

const initialState = {
  error: '',
};

export default function Component() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="mx-auto max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold">ログイン</h1>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <InputText type="email" id="email" name="email" className="w-full" />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <InputText
                type="password"
                id="password"
                name="password"
                className="w-full"
              />
            </div>
            {state && state.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <PrimaryButton type="submit" className="w-full bg-purple-600">
              ログイン
            </PrimaryButton>
          </form>
        </div>
      </main>
    </div>
  );
}
