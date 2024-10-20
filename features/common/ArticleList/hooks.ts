"use client";

import { useState } from "react";
import { ArticleType } from "@/types/article";
import { createClient } from "@/lib/supabase/client/browserClient";

export function useArticleList(initialArticles: ArticleType[], initialHasMore: boolean) {
  const [articleList, setArticleList] =
    useState<ArticleType[]>(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreArticles = async (page: number, pageSize: number = 5) => {
    const supabase = createClient();
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        content,
        image_url,
        description,
        created_at,
        article_categories (
          categories (name)
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      throw new Error('記事取得エラー');
    }

    const newArticles = data.map(article => ({
      id: article.id,
      title: article.title,
      content: article.content,
      image_url: article.image_url,
      description: article.description,
      created_at: article.created_at,
      categories: article.article_categories
        .map(ac => ac.categories?.name)
        .filter(Boolean)
    }));

    const hasMore = count ? count > ((page + 1) * pageSize) : false;

    return { articles: newArticles, hasMore };
  };

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const { articles: newArticles, hasMore: newHasMore } = await loadMoreArticles(nextPage);
      setArticleList(prevArticles => [...prevArticles, ...newArticles]);
      setHasMore(newHasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("記事の読み込みに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { articleList, isLoading, hasMore, handleLoadMore };
}
