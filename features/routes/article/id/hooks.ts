"use client";

import { useState, useEffect } from "react";
import { ArticleType } from "@/types/article";
import { CommentType } from "@/types/comment";

type TableOfContentsItem = {
  id: string;
  text: string;
};

export function useArticleDetail(
  initialLikes: number,
  initialComments: CommentType[],
  article: ArticleType
) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: CommentType = {
        id: comments.length + 1,
        author: "ゲスト",
        avatar: "/placeholder.svg",
        date: new Date().toLocaleDateString(),
        content: newComment.trim(),
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  useEffect(() => {
    // 記事のサマリーから目次を生成
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.summary, "text/html");
    const headings = doc.querySelectorAll("h1");

    const tocItems: TableOfContentsItem[] = Array.from(headings).map(
      (heading) => ({
        id: heading.id,
        text: heading.textContent || "",
      })
    );

    setTableOfContents(tocItems);
  }, [article.summary]);

  return {
    likes,
    handleLike,
    comments,
    newComment,
    setNewComment,
    handleCommentSubmit,
    tableOfContents,
  };
}
