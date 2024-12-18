'use client';

import ArticleList from '@/features/common/ArticleList/components/index';
import { ArticleType } from '@/types/article';

type PropType = {
  articles: ArticleType[];
  heading: string;
  initialHasMore: boolean;
};

export default function Component({ articles, heading, initialHasMore }: PropType) {
  return (
    <ArticleList articles={articles} heading={heading} initialHasMore={initialHasMore} />
  );
}
