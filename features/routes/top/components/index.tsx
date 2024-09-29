"use client";

import { useState } from "react";
import ArticleList from "@/features/common/ArticleList/components/index";
import { ArticleType } from "@/types/article";
import PrimaryButton from "@/components/common/PrimaryButton";
import type { Blog, BlogListResponse } from "@/types/microcmsBlog";
import { fetchBlogs } from "@/lib/microcms/actions/getBlogs";

type PropType = {
  articles: ArticleType[];
  heading: string;
};
export const revalidate = 0;

export default function Component({ articles, heading }: PropType) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      //   const response = await fetchBlogs();
      //   console.log(response);
      //   setBlogs(response.contents);
      const response = await fetch("/api/cron/linkage_micro_cms", {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        console.log("成功");
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (err) {
      console.error("ブログの取得に失敗しました:", err);
      setError("ブログの取得に失敗しました。再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <PrimaryButton onClick={handleFetchBlogs}>データフェッチ</PrimaryButton> */}
      <ArticleList articles={articles} heading={heading} />
    </>
  );
}
