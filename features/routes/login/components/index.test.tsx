import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from './index';
import '@testing-library/jest-dom';

jest.mock('react', () => {
  const actualReact = jest.requireActual('react') as typeof React;
  return {
    ...actualReact,
    useActionState: jest.fn(),
  };
});

jest.mock('../actions/login', () => ({
  loginAction: jest.fn(),
}));

const mockUseActionState = React.useActionState as jest.MockedFunction<typeof React.useActionState>;

describe('Login Component', () => {
  beforeEach(() => {
    mockUseActionState.mockReturnValue([
      { error: '' },
      jest.fn(),
      false
    ]);
  });

  it('ログインコンポーネントが表示される', () => {
    render(<Component />);
    
    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('ログイン失敗時のエラーメッセージを表示', () => {
    const errorMessage = 'ログインに失敗しました。';
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
    await user.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(mockFormAction).toHaveBeenCalled();
  });
});