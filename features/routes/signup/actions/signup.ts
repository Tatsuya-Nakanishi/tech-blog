'use server';

import { createClient } from '@/lib/supabase/client/serverClient';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください。'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります。'),
});

type LoginState = {
  error?: string;
};

export async function signupAction(prevState: LoginState, formData: FormData) {
  const supabase = await createClient();
  let redirectTo = '';

  const validatedFields = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: '入力内容に誤りがあります。すべての項目を正しく入力してください。' };
  }

  const { email, password } = validatedFields.data;

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: 'サインアップに失敗しました。再度お試しください。' };
    }

    redirectTo = '/top';
  } catch (err) {
    console.log(err);
    return { error: 'サインアップに失敗しました。再度お試しください。' };
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
}
