import { signupAction } from './signup';
import { createClient } from "@/lib/supabase/client/serverClient";
import { redirect } from 'next/navigation';

// 依存関係のモック
jest.mock("@/lib/supabase/client/serverClient", () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('signupAction', () => {
  let mockSignUp: jest.Mock;
  let mockSupabase: { auth: { signUp: jest.Mock } };

  beforeEach(() => {
    mockSignUp = jest.fn();
    mockSupabase = {
      auth: {
        signUp: mockSignUp,
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

    const result = await signupAction({}, formData);

    expect(result).toEqual({ error: "入力内容に誤りがあります。すべての項目を正しく入力してください。" });
  });

  it('パスワードが8文字未満の場合、エラーを返す', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', 'short');

    const result = await signupAction({}, formData);

    expect(result).toEqual({ error: "入力内容に誤りがあります。すべての項目を正しく入力してください。" });
  });

  it('サインアップが失敗した場合、エラーを返す', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', 'password123');

    mockSignUp.mockResolvedValue({ error: new Error('サインアップ失敗') });

    const result = await signupAction({}, formData);

    expect(result).toEqual({ error: "サインアップに失敗しました。再度お試しください。" });
  });

  it('サインアップが成功した場合、Topページにリダイレクトする', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', 'password123');

    mockSignUp.mockResolvedValue({ error: null });

    await signupAction({}, formData);

    expect(redirect).toHaveBeenCalledWith('/top');
  });

  it('例外時にはエラーメッセージを返す', async () => {
    const formData = new FormData();
    formData.append('email', 'valid@email.com');
    formData.append('password', 'password123');

    mockSignUp.mockRejectedValue(new Error('予期せぬエラー'));

    const result = await signupAction({}, formData);

    expect(result).toEqual({ error: "サインアップに失敗しました。再度お試しください。" });
  });
});