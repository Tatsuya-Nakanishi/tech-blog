"use client";

import { useState, useEffect } from "react";
import { ArticleType } from "@/types/article";
import { CommentType } from "@/types/comment";
import { createClient } from "@/lib/supabase/client/browserClient";
import { UserType } from "@/types/user";
import { useLoading } from '@/contexts/LoadingContext';

type TableOfContentsItem = {
  id: string;
  text: string;
};

export function useArticleDetail(
  initialLikes: number,
  initialComments: CommentType[],
  article: ArticleType,
  user: UserType | null,
  isLiked: boolean,
) {
  const { setIsLoading } = useLoading();
  const supabase = createClient();

  const [likes, setLikes] = useState(initialLikes);
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(isLiked);
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLike = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

     try {
      setIsLoading(true);
      const { data: existingLike, error: fetchError } = await supabase
        .from('likes')
        .select()
        .eq('user_id', user.id)
        .eq('article_id', article.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing like:', fetchError);
        return;
      }

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', article.id);

        if (deleteError) {
          console.error('Error removing like:', deleteError);
          return;
        }

        setLikes(prevLikes => Math.max(0, prevLikes - 1));
        setIsAlreadyLiked(false);
      } else {
        const { error: insertError } = await supabase
          .from('likes')
          .insert({ user_id: user.id, article_id: article.id });

        if (insertError) {
          console.error('Error adding like:', insertError);
          return;
        }

        setLikes(prevLikes => prevLikes + 1);
        setIsAlreadyLiked(true);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!newComment.trim()) {
      alert('コメントを入力してください。');
      return;
    }

    try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('comments')
          .insert({
            user_id: user.id,
            article_id: article.id,
            content: newComment
          })
          .select('*, users(id, nickname, avatar_url)')
          .single();

        if (error) throw error;

        const newCommentObj: CommentType = {
          id: data.id,
          author: data.users?.nickname || user.nickname || "匿名",
          avatar: data.users?.avatar_url || user.avatar_url || "",
          userId: data.users?.id || '',
          date: new Date(data.created_at).toLocaleDateString(),
          content: data.content,
        };

        setComments(prevComments => [...prevComments, newCommentObj]);
        setNewComment("");
      } catch (error) {
        console.error('コメントの送信エラー:', error);
      } finally {
        setIsLoading(false);
      }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('コメントの削除エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 記事のサマリーから目次を生成
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, "text/html");
    const headings = doc.querySelectorAll("h1");
    const tocItems: TableOfContentsItem[] = Array.from(headings).map(
      (heading) => ({
        id: heading.id,
        text: heading.textContent || "",
      })
    );

    setTableOfContents(tocItems);
  }, [article.content]);

  return {
    likes,
    handleLike,
    comments,
    newComment,
    setNewComment,
    handleCommentSubmit,
    handleCommentDelete,
    tableOfContents,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isAlreadyLiked
  };
}
