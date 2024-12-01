'use client';

import { useState } from 'react';
import { ArticleType } from '@/types/article';
import { useLoading } from '@/contexts/LoadingContext';
import { getMoreArticles } from '../actions/getMoreArticles';

export function useArticleList(initialArticles: ArticleType[], initialHasMore: boolean) {
  const [articleList, setArticleList] = useState<ArticleType[]>(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const { setIsLoading } = useLoading();

  const handleLoadMore = async () => {
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const { articles: newArticles, hasMore: newHasMore } =
        await getMoreArticles(nextPage);
      setArticleList((prevArticles) => [...prevArticles, ...newArticles]);
      setHasMore(newHasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('記事の読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { articleList, hasMore, handleLoadMore };
}
