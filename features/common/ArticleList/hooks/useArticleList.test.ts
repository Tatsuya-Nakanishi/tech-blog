import { renderHook, act } from '@testing-library/react';
import { useArticleList } from './useArticleList';
import { getMoreArticles } from '../actions/getMoreArticles';
import { useLoading } from '@/contexts/LoadingContext';

// getMoreArticlesとuseLoadingをモック化
jest.mock('../actions/getMoreArticles');
jest.mock('@/contexts/LoadingContext');

describe('useArticleList', () => {
  const mockSetIsLoading = jest.fn();
  const mockInitialArticles = [
    {
      id: '1',
      title: '記事1',
      content: '内容1',
      image_url: 'url1',
      description: '説明1',
      created_at: '2023-01-01',
      categories: ['カテゴリ1'],
    },
    {
      id: '2',
      title: '記事2',
      content: '内容2',
      image_url: 'url2',
      description: '説明2',
      created_at: '2023-01-02',
      categories: ['カテゴリ2'],
    },
  ];

  beforeEach(() => {
    (useLoading as jest.Mock).mockReturnValue({ setIsLoading: mockSetIsLoading });
    (getMoreArticles as jest.Mock).mockResolvedValue({
      articles: [
        {
          id: '3',
          title: '記事3',
          content: '内容3',
          image_url: 'url3',
          description: '説明3',
          created_at: '2023-01-03',
          categories: ['カテゴリ3'],
        },
      ],
      hasMore: false,
    });
  });

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() => useArticleList(mockInitialArticles, true));

    expect(result.current.articleList).toEqual(mockInitialArticles);
    expect(result.current.hasMore).toBe(true);
  });

  it('handleLoadMoreが正しく動作すること', async () => {
    const { result } = renderHook(() => useArticleList(mockInitialArticles, true));

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    expect(result.current.articleList).toHaveLength(3);
    expect(result.current.hasMore).toBe(false);
  });

  it('エラー発生時にコンソールにエラーが出力されること', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (getMoreArticles as jest.Mock).mockRejectedValue(new Error('テストエラー'));

    const { result } = renderHook(() => useArticleList(mockInitialArticles, true));

    await act(async () => {
      await result.current.handleLoadMore();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '記事の読み込みに失敗しました:',
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });
});
