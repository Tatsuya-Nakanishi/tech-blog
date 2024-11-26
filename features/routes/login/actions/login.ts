'use server';

import { createClient } from '@/lib/supabase/client/serverClient';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください。'),
  password: z.string().min(1, 'パスワードを入力してください。'),
});

type loginState = {
  error?: string;
};

export async function loginAction(prevState: loginState, formData: FormData) {
  const supabase = await createClient();
  let redirectTo = '';

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: 'メールアドレスとパスワードを正しく入力してください。' };
  }

  const { email, password } = validatedFields.data;

  try {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return { error: 'ログインに失敗しました。再度お試しください。' };
    }

    redirectTo = '/top';
  } catch (err) {
    console.log(err);
    return { error: 'ログインに失敗しました。再度お試しください。' };
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
}
