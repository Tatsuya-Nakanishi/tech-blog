import { getMoreArticles } from './getMoreArticles';
import { createClient } from '@/lib/supabase/client/serverClient';

// createClientをモック化
jest.mock('@/lib/supabase/client/serverClient');

describe('getMoreArticles', () => {
  const mockSupabaseSelect = jest.fn();
  const mockSupabaseFrom = jest.fn(() => ({
    select: mockSupabaseSelect,
  }));

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue({
      from: mockSupabaseFrom,
    });

    mockSupabaseSelect.mockReturnValue({
      order: jest.fn().mockReturnValue({
        range: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              title: '記事1',
              content: '内容1',
              image_url: 'url1',
              description: '説明1',
              created_at: '2023-01-01',
              article_categories: [{ categories: { name: 'カテゴリ1' } }],
            },
            {
              id: '2',
              title: '記事2',
              content: '内容2',
              image_url: 'url2',
              description: '説明2',
              created_at: '2023-01-02',
              article_categories: [{ categories: { name: 'カテゴリ2' } }],
            },
          ],
          error: null,
          count: 5,
        }),
      }),
    });
  });

  it('正しく記事を取得できること', async () => {
    const result = await getMoreArticles(1, 2);

    expect(result.articles).toHaveLength(2);
    expect(result.articles[0]).toEqual({
      id: '1',
      title: '記事1',
      content: '内容1',
      image_url: 'url1',
      description: '説明1',
      created_at: '2023-01-01',
      categories: ['カテゴリ1'],
    });
    expect(result.hasMore).toBe(true);
  });

  it('エラー発生時に例外をスローすること', async () => {
    mockSupabaseSelect.mockReturnValue({
      order: jest.fn().mockReturnValue({
        range: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('テストエラー'),
          count: null,
        }),
      }),
    });

    await expect(getMoreArticles(1, 2)).rejects.toThrow('記事取得エラー');
  });

  it('最後のページで hasMore が false になること', async () => {
    mockSupabaseSelect.mockReturnValue({
      order: jest.fn().mockReturnValue({
        range: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              title: '記事1',
              content: '内容1',
              image_url: 'url1',
              description: '説明1',
              created_at: '2023-01-01',
              article_categories: [{ categories: { name: 'カテゴリ1' } }],
            },
          ],
          error: null,
          count: 1,
        }),
      }),
    });

    const result = await getMoreArticles(1, 2);

    expect(result.hasMore).toBe(false);
  });
});
