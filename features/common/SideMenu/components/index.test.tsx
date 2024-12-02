import React from 'react';
import { render, screen } from '@testing-library/react';
import Component from './index';

const mockCategories = [{ name: 'プログラミング' }, { name: '日常' }];

const mockArchives = ['2024年3月', '2024年2月'];

describe('SideMenu Component', () => {
  it('管理人セクションが正しくレンダリングされる', () => {
    render(<Component categories={[]} archives={[]} />);
    expect(screen.getByText('ブログの管理人')).toBeInTheDocument();
    expect(screen.getByText('たつなり')).toBeInTheDocument();
    expect(screen.getByText('フリーランスエンジニア')).toBeInTheDocument();
  });

  it('カテゴリーが正しくレンダリングされる', () => {
    render(<Component categories={mockCategories} archives={[]} />);
    expect(screen.getByText('カテゴリー')).toBeInTheDocument();
    expect(screen.getByText('#プログラミング')).toBeInTheDocument();
    expect(screen.getByText('#日常')).toBeInTheDocument();
  });

  it('アーカイブが正しくレンダリングされる', () => {
    render(<Component categories={[]} archives={mockArchives} />);
    expect(screen.getByText('アーカイブ')).toBeInTheDocument();
    expect(screen.getByText('2024年3月')).toBeInTheDocument();
    expect(screen.getByText('2024年2月')).toBeInTheDocument();
  });
});
