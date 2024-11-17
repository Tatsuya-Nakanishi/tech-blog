import * as React from 'react';
import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from './index';
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useActionState: jest.fn(),
  };
});

jest.mock('../actions/signup', () => ({
  signupAction: jest.fn(),
}));

jest.mock("next/link", () => {
  const mockLink = ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          mockRouter.push(href);
          if (onClick) onClick();
        }}
      >
        {children}
      </a>
    );
  };
  mockLink.displayName = "Link";
  return mockLink;
});

const mockUseActionState = React.useActionState as jest.MockedFunction<typeof React.useActionState>;

describe('Signup Component', () => {
  beforeEach(() => {
    mockUseActionState.mockReturnValue([
      { error: '' },
      jest.fn(),
      false
    ]);
  });

  it('サインアップコンポーネントが正しく表示される', () => {
    render(<Component />);
    
    expect(screen.getByRole('heading', { name: 'サインアップ' })).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'サインアップ' })).toBeInTheDocument();
    expect(screen.getByText('アカウントをお持ちですか？')).toBeInTheDocument();
    expect(screen.getByText('ログインはこちら')).toBeInTheDocument();
  });

  it('サインアップ失敗時のエラーメッセージを表示', () => {
    const errorMessage = 'サインアップに失敗しました。';
    mockUseActionState.mockReturnValue([
      { error: errorMessage },
      jest.fn(),
      false
    ]);

    render(<Component />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('フォームの送信', async () => {
    const user = userEvent.setup();
    const mockFormAction = jest.fn();
    mockUseActionState.mockReturnValue([
      { error: '' },
      mockFormAction,
      false
    ]);

    render(<Component />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'password123');
    await user.click(screen.getByRole('button', { name: 'サインアップ' }));

    expect(mockFormAction).toHaveBeenCalled();
  });

  it('ログインページへのリンクが正しく機能する', async () => {
    const user = userEvent.setup();
    render(<Component />);

    mockRouter.setCurrentUrl('/login');
    const loginLink = screen.getByText('ログインはこちら');
    await user.click(loginLink);

    expect(mockRouter.asPath).toEqual('/login');
  });
});