import type { MicroCMSImage, MicroCMSDate } from "microcms-js-sdk";

// カテゴリの型定義
export type Category = {
  id: string;
  createdAt: MicroCMSDate;
  updatedAt: MicroCMSDate;
  publishedAt: MicroCMSDate;
  revisedAt: MicroCMSDate;
  name: string;
};

// ブログ記事の型定義
export type Blog = {
  id: string;
  createdAt: MicroCMSDate;
  updatedAt: MicroCMSDate;
  publishedAt: MicroCMSDate;
  revisedAt: MicroCMSDate;
  title: string;
  content: string;
  description: string;
  eyecatch: MicroCMSImage;
  category: Category[];
};

// ブログ一覧取得時のレスポンス型定義
export type BlogListResponse = {
  contents: Blog[];
  totalCount: number;
  offset: number;
  limit: number;
};
