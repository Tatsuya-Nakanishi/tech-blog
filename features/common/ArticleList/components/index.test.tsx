import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './index';
import { useArticleList } from '../hooks/useArticleList';
import { ArticleType } from '@/types/article';

// useArticleListフックをモック化
jest.mock('../hooks/useArticleList');

// Link コンポーネントをモック化
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );

  // displayNameを設定
  MockLink.displayName = 'MockLink';

  return MockLink;
});

describe('ArticleList Component', () => {
  const mockArticles: ArticleType[] = [
    {
      id: '1',
      title: 'テスト記事1',
      content: 'テスト記事1の内容',
      image_url: 'https://example.com/image1.jpg',
      created_at: '2023-01-01T00:00:00Z',
      categories: ['カテゴリ1', 'カテゴリ2'],
      description: 'テスト記事1の説明',
    },
    {
      id: '2',
      title: 'テスト記事2',
      content: 'テスト記事2の内容',
      image_url: 'https://example.com/image2.jpg',
      created_at: '2023-01-02T00:00:00Z',
      categories: ['カテゴリ3'],
      description: 'テスト記事2の説明',
    },
  ];

  beforeEach(() => {
    (useArticleList as jest.Mock).mockReturnValue({
      articleList: mockArticles,
      hasMore: true,
      handleLoadMore: jest.fn(),
    });
  });

  it('記事リストが正しくレンダリングされること', () => {
    render(
      <Component articles={mockArticles} heading="テスト見出し" initialHasMore={true} />
    );

    expect(screen.getByText('テスト見出し')).toBeInTheDocument();
    expect(screen.getByText('テスト記事1')).toBeInTheDocument();
    expect(screen.getByText('テスト記事2')).toBeInTheDocument();
    expect(screen.getByText('2023年01月01日')).toBeInTheDocument();
    expect(screen.getByText('2023年01月02日')).toBeInTheDocument();
    expect(screen.getByText('#カテゴリ1')).toBeInTheDocument();
    expect(screen.getByText('#カテゴリ2')).toBeInTheDocument();
    expect(screen.getByText('#カテゴリ3')).toBeInTheDocument();
  });

  it('「もっと見る」ボタンが表示され、クリックできること', () => {
    const mockHandleLoadMore = jest.fn();
    (useArticleList as jest.Mock).mockReturnValue({
      articleList: mockArticles,
      hasMore: true,
      handleLoadMore: mockHandleLoadMore,
    });

    render(
      <Component articles={mockArticles} heading="テスト見出し" initialHasMore={true} />
    );

    const loadMoreButton = screen.getByText('もっと見る');
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);
    expect(mockHandleLoadMore).toHaveBeenCalledTimes(1);
  });

  it('記事が存在しない場合、適切なメッセージが表示されること', () => {
    (useArticleList as jest.Mock).mockReturnValue({
      articleList: [],
      hasMore: false,
      handleLoadMore: jest.fn(),
    });

    render(<Component articles={[]} heading="テスト見出し" initialHasMore={false} />);

    expect(screen.getByText('検索結果はありません。')).toBeInTheDocument();
    expect(screen.queryByText('もっと見る')).not.toBeInTheDocument();
  });

  it('hasMoreがfalseの場合、「もっと見る」ボタンが表示されないこと', () => {
    (useArticleList as jest.Mock).mockReturnValue({
      articleList: mockArticles,
      hasMore: false,
      handleLoadMore: jest.fn(),
    });

    render(
      <Component articles={mockArticles} heading="テスト見出し" initialHasMore={false} />
    );

    expect(screen.queryByText('もっと見る')).not.toBeInTheDocument();
  });
});
