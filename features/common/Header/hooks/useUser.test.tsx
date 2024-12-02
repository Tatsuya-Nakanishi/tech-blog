import { renderHook } from '@testing-library/react';
import { useUser } from './useUser';
import { logout } from '../actions/logout';
import { useRouter } from 'next/navigation';

// モックの設定
jest.mock('../actions/logout');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useUser', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('ログアウトが成功した場合、ホームページに遷移してリフレッシュする', async () => {
    const { result } = renderHook(() => useUser());
    (logout as jest.Mock).mockResolvedValueOnce(undefined);

    await result.current.handleLogout();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
    expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
  });

  it('ログアウトが失敗した場合でも、ホームページに遷移してリフレッシュする', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const { result } = renderHook(() => useUser());
    const mockError = new Error('Logout failed');
    (logout as jest.Mock).mockRejectedValueOnce(mockError);

    await result.current.handleLogout();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', mockError);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
    expect(mockRouter.refresh).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
