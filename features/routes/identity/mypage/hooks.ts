"use client";

import { useState } from "react";
import { ArticleType } from "@/types/article";
import { UserType } from "@/types/user";

const addArticles: ArticleType[] = [
  {
    id: 6,
    title: "Next.jsのパフォーマンス最適化",
    date: "2021.9.1",
    tags: ["Next.js", "Performance"],
    summary:
      "Next.jsアプリケーションのパフォーマンスを向上させる方法を解説します。",
    imageUrl: "/images/nextjs_performance.jpg",
  },
  {
    id: 7,
    title: "GraphQL入門",
    date: "2021.9.10",
    tags: ["GraphQL", "API"],
    summary: "GraphQLの基本的な概念と使い方を学びます。",
    imageUrl: "/images/graphql_intro.jpg",
  },
  {
    id: 8,
    title: "Webpackの基本",
    date: "2021.9.15",
    tags: ["Webpack", "Module Bundler"],
    summary: "Webpackを使ってプロジェクトを構築する方法を説明します。",
    imageUrl: "/images/webpack_basics.jpg",
  },
  {
    id: 9,
    title: "Dockerによる開発環境構築",
    date: "2021.9.20",
    tags: ["Docker", "DevOps"],
    summary: "Dockerを使った開発環境の構築方法を紹介します。",
    imageUrl: "/images/docker_dev_env.jpg",
  },
  {
    id: 10,
    title: "CI/CDパイプラインの構築",
    date: "2021.9.25",
    tags: ["CI/CD", "DevOps"],
    summary: "継続的インテグレーションとデプロイのパイプラインを構築します。",
    imageUrl: "/images/ci_cd_pipeline.jpg",
  },
];

export function useMyPage(user: UserType, initialLikedArticles: ArticleType[]) {
  const [userData, setUserData] = useState<UserType>(user);
  const [likedArticles, setLikedArticles] =
    useState<ArticleType[]>(initialLikedArticles);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const handleUpdate = () => {
    // ユーザー情報の更新処理をここに実装
    console.log("Update user info", userData);
  };

  const handleLoadMore = () => {
    setLikedArticles((prevArticles) => [...prevArticles, ...addArticles]);
    setHasLoadedMore(true);
  };

  return {
    userData,
    setUserData,
    likedArticles,
    handleUpdate,
    handleLoadMore,
    hasLoadedMore,
  };
}
