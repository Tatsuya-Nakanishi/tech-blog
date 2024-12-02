import { render, screen, fireEvent } from '@testing-library/react';
import Header from './index';
import { useUser } from '../hooks/useUser';
import { useMenu } from '../hooks/useMenu';
import { UserType } from '@/types/user';

// モックの設定
jest.mock('../hooks/useUser');
jest.mock('../hooks/useMenu');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// モックの追加
jest.mock('@/components/common/Avatar', () => {
  return jest.fn().mockImplementation((props) => {
    return <div data-testid="mocked-avatar" {...props} />;
  });
});

describe('Header', () => {
  const mockHandleLogout = jest.fn();
  const mockToggleMenu = jest.fn();
  const mockSetIsMenuOpen = jest.fn();
  const mockSetMenuElement = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ handleLogout: mockHandleLogout });
    (useMenu as jest.Mock).mockReturnValue({
      isMenuOpen: false,
      toggleMenu: mockToggleMenu,
      setIsMenuOpen: mockSetIsMenuOpen,
      setMenuElement: mockSetMenuElement,
    });
  });

  describe('ログイン済みユーザーの場合', () => {
    const mockUser: UserType = {
      id: '1',
      email: 'test@example.com',
      nickname: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('デスクトップ表示で適切なナビゲーションが表示される', () => {
      render(<Header user={mockUser} />);

      expect(screen.getByText('マイページ')).toBeInTheDocument();
      expect(screen.getByText('ログアウト')).toBeInTheDocument();
    });

    it('アバターコンポーネントが正しく呼び出される', () => {
      render(<Header user={mockUser} />);

      const avatarComponents = screen.getAllByTestId('mocked-avatar');
      expect(avatarComponents).toHaveLength(2); // デスクトップとモバイルの両方
      expect(avatarComponents[0]).toHaveAttribute('src', mockUser.avatar_url);
      expect(avatarComponents[0]).toHaveAttribute('alt', 'icon');
    });

    it('ログアウトボタンをクリックするとhandleLogoutが呼ばれる', () => {
      render(<Header user={mockUser} />);

      fireEvent.click(screen.getByText('ログアウト'));
      expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    });

    it('モバイル表示でメニューを開閉できる', () => {
      (useMenu as jest.Mock).mockReturnValue({
        isMenuOpen: true,
        toggleMenu: mockToggleMenu,
        setIsMenuOpen: mockSetIsMenuOpen,
        setMenuElement: mockSetMenuElement,
      });

      render(<Header user={mockUser} />);

      const menuButton = screen.getByLabelText('Close menu');
      fireEvent.click(menuButton);
      expect(mockToggleMenu).toHaveBeenCalledTimes(1);
    });
  });

  describe('未ログインユーザーの場合', () => {
    it('デスクトップ表示で適切なナビゲーションが表示される', () => {
      render(<Header user={null} />);

      expect(screen.getByText('ログイン')).toBeInTheDocument();
      expect(screen.getByText('新規登録')).toBeInTheDocument();
    });

    it('モバイル表示でメニューアイコンが表示される', () => {
      render(<Header user={null} />);

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('モバイルメニューを開いた時に適切な項目が表示される', () => {
      (useMenu as jest.Mock).mockReturnValue({
        isMenuOpen: true,
        toggleMenu: mockToggleMenu,
        setIsMenuOpen: mockSetIsMenuOpen,
        setMenuElement: mockSetMenuElement,
      });

      render(<Header user={null} />);

      expect(screen.getAllByText('ログイン')).toHaveLength(2); // デスクトップとモバイル
      expect(screen.getAllByText('新規登録')).toHaveLength(2); // デスクトップとモバイル
    });
  });
});
