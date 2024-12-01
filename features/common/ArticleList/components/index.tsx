'use client';

import Link from 'next/link';
import { useArticleList } from '../hooks/useArticleList';
import { ArticleType } from '@/types/article';
import PrimaryButton from '@/components/common/PrimaryButton';
import Tag from '@/components/common/Tag';
import { format } from 'date-fns';

type PropType = {
  articles: ArticleType[];
  heading: string;
  initialHasMore: boolean;
};

export const revalidate = 0;

export default function Component({ articles, heading, initialHasMore }: PropType) {
  const { articleList, hasMore, handleLoadMore } = useArticleList(
    articles,
    initialHasMore
  );

  // const handleFetchBlogs = async () => {
  //   try {
  //     const response = await fetch('/api/cron/linkage_micro_cms', {
  //       method: 'GET',
  //       cache: 'no-store',
  //     });

  //     if (response.ok) {
  //       console.log('成功');
  //     } else {
  //       const errorText = await response.text();
  //       console.log(errorText);
  //     }
  //   } catch (err) {
  //     console.error('ブログの取得に失敗しました:', err);
  //   } finally {
  //   }
  // };

  return (
    <div className="md:w-2/3">
      {/* <PrimaryButton onClick={handleFetchBlogs}>データフェッチ</PrimaryButton> */}
      <h2 className="mb-4 text-2xl font-bold">{heading}</h2>
      {/* 記事が存在する場合 */}
      {articleList.length > 0 ? (
        <>
          {articleList.map((article) => (
            <article key={article.id} className="mb-8 border-b pb-4">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={article.image_url || ''}
                    alt="記事のサムネイル"
                  />
                </div>
                <div className="mt-4 md:ml-6 md:mt-0">
                  <h3 className="mb-2 text-xl font-semibold">
                    <Link
                      href={`/article/${article.id}`}
                      className="hover:text-purple-600"
                      prefetch={true}
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <div className="mb-2 text-sm text-gray-500">
                    {format(new Date(article.created_at), 'yyyy年MM月dd日')}
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {article.categories.map((category, index) => (
                      <Tag backgroundColor="bg-gray-200" key={index}>
                        #{category}
                      </Tag>
                    ))}
                  </div>
                  <p className="text-gray-700">{article.description}</p>
                </div>
              </div>
            </article>
          ))}

          {/* もっと見るボタン */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <PrimaryButton width="w-80" onClick={handleLoadMore}>
                もっと見る
              </PrimaryButton>
            </div>
          )}
        </>
      ) : (
        /* 記事が存在しない場合 */
        <p className="mt-8 text-center text-gray-500">検索結果はありません。</p>
      )}
    </div>
  );
}
