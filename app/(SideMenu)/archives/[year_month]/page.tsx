import YearMonth from "@/features/routes/year_month/components";

const articles = [
  {
    id: 1,
    title: "Next.jsでブログを作ろう！",
    date: "2021.8.5",
    tags: ["Next.js", "React", "Web開発"],
    summary: "Next.jsを使ってブログを作成する方法を詳細に解説します。",
    imageUrl: "https://future-architect.github.io/images/20240228a/top.jpg",
  },
  {
    id: 2,
    title: "TypeScriptの基本をマスターする",
    date: "2021.8.10",
    tags: ["TypeScript", "JavaScript"],
    summary: "TypeScriptの基本的な使い方とその利点について解説します。",
    imageUrl: "https://future-architect.github.io/images/20240228a/top.jpg",
  },
  {
    id: 3,
    title: "React Hooks徹底解説",
    date: "2021.8.15",
    tags: ["React", "Hooks"],
    summary: "React Hooksを使いこなすためのガイドです。",
    imageUrl: "https://future-architect.github.io/images/20240228a/top.jpg",
  },
  {
    id: 4,
    title: "フロントエンドテスト入門",
    date: "2021.8.20",
    tags: ["テスト", "Jest", "Cypress"],
    summary: "フロントエンド開発におけるテストの重要性と基本を学びます。",
    imageUrl: "https://future-architect.github.io/images/20240228a/top.jpg",
  },
  {
    id: 5,
    title: "Next.jsのSSRとSSGを理解する",
    date: "2021.8.25",
    tags: ["Next.js", "SSR", "SSG"],
    summary:
      "Next.jsのサーバーサイドレンダリングと静的サイト生成について詳しく説明します。",
    imageUrl: "https://future-architect.github.io/images/20240228a/top.jpg",
  },
];

export default function Page({
  params,
}: {
  params: { year_month: string };
}) {
  const { year_month } = params;
  return <YearMonth articles={articles} heading={year_month} />;
}
