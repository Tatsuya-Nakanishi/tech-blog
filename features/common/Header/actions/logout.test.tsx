import { logout } from './logout';
import { createClient } from '@/lib/supabase/client/serverClient';
import { redirect } from 'next/navigation';

// モックの設定
jest.mock('@/lib/supabase/client/serverClient');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('logout', () => {
  const mockSignOut = jest.fn();
  const mockSupabaseClient = {
    auth: {
      signOut: mockSignOut,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);
  });

  it('ログアウトが成功した場合、ホームページにリダイレクトする', async () => {
    mockSignOut.mockResolvedValueOnce({ error: null });

    await logout();

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('ログアウトが失敗した場合、エラーをスローする', async () => {
    const mockError = { message: 'Logout failed' };
    mockSignOut.mockResolvedValueOnce({ error: mockError });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(logout()).rejects.toThrow('Logout failed');

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', mockError.message);
    expect(redirect).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
