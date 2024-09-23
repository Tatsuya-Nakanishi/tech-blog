import { client } from "@/lib/microcms/client/client";
import type { Blog, BlogListResponse } from "@/types/microcmsBlog";
import type { MicroCMSQueries } from "microcms-js-sdk";

/**
 * ブログ一覧を取得する関数
 * @param queries - microCMSに渡すクエリパラメータ
 * @returns ブログ一覧のレスポンス
 */
export const fetchBlogs = async (
  queries?: MicroCMSQueries
): Promise<BlogListResponse> => {
  try {
    const data = await client.getList<Blog>({
      endpoint: "blogs",
      queries: queries,
    });
    return data;
  } catch (error) {
    console.error("ブログ一覧の取得エラー:", error);
    throw error;
  }
};
