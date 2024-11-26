import { loginAction } from './login';
import { createClient } from '@/lib/supabase/client/serverClient';
import { redirect } from 'next/navigation';

// 依存関係のモック
jest.mock('@/lib/supabase/client/serverClient', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('loginAction', () => {
  let mockSignInWithPassword: jest.Mock;
  let mockSupabase: { auth: { signInWithPassword: jest.Mock } };

  beforeEach(() => {
    mockSignInWithPassword = jest.fn();
    mockSupabase = {
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('無効なメールアドレスの場合、エラーを返す', async () => {
    const formData = new FormData();
    formData.append('email', 'invalid-email');
    formData.append('password', 'password123');

    const result = await loginAction({}, formData);

    expect(result).toEqual({
      error: 'メールアドレスとパスワードを正しく入力してください。',
    });
  });

  it('パスワードが空の場合、エラーを返す', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', '');

    const result = await loginAction({}, formData);

    expect(result).toEqual({
      error: 'メールアドレスとパスワードを正しく入力してください。',
    });
  });

  it('ログインが失敗した場合、エラーを返す', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', 'password123');

    mockSignInWithPassword.mockResolvedValue({ error: new Error('ログイン失敗') });

    const result = await loginAction({}, formData);

    expect(result).toEqual({ error: 'ログインに失敗しました。再度お試しください。' });
  });

  it('ログインが成功した場合、Topページにリダイレクトする', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', 'password123');

    mockSignInWithPassword.mockResolvedValue({ error: null });

    await loginAction({}, formData);

    expect(redirect).toHaveBeenCalledWith('/top');
  });

  it('例外時にはエラーメッセージを返す', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', 'password123');

    mockSignInWithPassword.mockRejectedValue(new Error('予期せぬエラー'));

    const result = await loginAction({}, formData);

    expect(result).toEqual({ error: 'ログインに失敗しました。再度お試しください。' });
  });
});
