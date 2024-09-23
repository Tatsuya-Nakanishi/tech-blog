"use client";

import Link from "next/link";
import SideMenu from "@/features/common/SideMenu/components/index";
import { useArticleList } from "../hooks";
import { ArticleType } from "@/types/article";
import PrimaryButton from "@/components/common/PrimaryButton";
import Tag from "@/components/common/Tag";

type PropType = {
  articles: ArticleType[];
  heading: string;
};

export default function Component({ articles, heading }: PropType) {
  const { articleList, hasLoadedMore, handleLoadMore } =
    useArticleList(articles);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto flex-grow p-4 md:flex md:space-x-4">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">{heading}</h2>
          {articleList.map((article) => (
            <article key={article.id} className="mb-8 border-b pb-4">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={article.imageUrl}
                    alt="記事のサムネイル"
                  />
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link
                      href={`/article/${article.id}`}
                      className="hover:text-purple-600"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <div className="text-sm text-gray-500 mb-2">
                    {article.date}
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Tag backgroundColor="bg-gray-200" key={index}>
                        #{tag}
                      </Tag>
                    ))}
                  </div>
                  <p className="text-gray-700">{article.summary}</p>
                </div>
              </div>
            </article>
          ))}
          {!hasLoadedMore && (
            <div className="flex justify-center mt-8">
              <PrimaryButton width="w-80" onClick={handleLoadMore}>
                もっと見る
              </PrimaryButton>
            </div>
          )}
        </div>
        <SideMenu />
      </main>
    </div>
  );
}
