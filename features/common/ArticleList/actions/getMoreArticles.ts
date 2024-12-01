'use server';

import { createClient } from '@/lib/supabase/client/serverClient';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { ArticleType } from '@/types/article';

export async function getMoreArticles(page: number, pageSize: number = ITEMS_PER_PAGE) {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from('articles')
    .select(
      `
      id,
      title,
      content,
      image_url,
      description,
      created_at,
      article_categories (
        categories (name)
      )
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) {
    throw new Error('記事取得エラー');
  }

  const articles: ArticleType[] = data.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    image_url: article.image_url,
    description: article.description,
    created_at: article.created_at,
    categories: article.article_categories
      .map((ac) => ac.categories?.name)
      .filter(Boolean),
  }));

  const hasMore = count ? count > (page + 1) * pageSize : false;

  return { articles, hasMore };
}
