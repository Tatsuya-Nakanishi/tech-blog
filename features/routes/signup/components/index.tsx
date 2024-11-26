'use client';

import Link from 'next/link';
import InputText from '@/components/common/InputText';
import { Label } from '@/components/ui/label';
import { signupAction } from '../actions/signup';
import { useActionState } from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';

const initialState = {
  error: '',
};

export default function Component() {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="mx-auto max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold">サインアップ</h1>
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
              <div className="text-center text-sm text-red-500">{state.error}</div>
            )}
            <div>
              <PrimaryButton type="submit">サインアップ</PrimaryButton>
            </div>
          </form>
          <div className="mt-3 text-center text-sm">
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
