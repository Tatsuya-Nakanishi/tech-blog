"use client";

import { useState, useCallback, useRef } from "react";
import { ArticleType } from "@/types/article";
import { UserType } from "@/types/user";
import { createClient } from "@/lib/supabase/client/browserClient";

export function useMyPage(user: UserType, initialLikedArticles: ArticleType[], initialHasMore: boolean) {
  const supabase = createClient();
  const [userData, setUserData] = useState<UserType>(user);
  const [likedArticles, setLikedArticles] =
    useState<ArticleType[]>(initialLikedArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userData?.avatar_url || null
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null);
    e.preventDefault();

    try {
      let avatar_url = userData.avatar_url;
      let old_avatar_path: string | null = userData.avatar_url || null;

      // 新しいアバター画像が選択されている場合、Supabase Storage にアップロード
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userData.id}-${Date.now()}.${fileExt}`;
        const filePath = `${userData.id}/${fileName}`;

        // 画像をアップロード
        const { error: avatarUpdateError } = await supabase
          .storage
          .from('user_avatars') // バケット名を 'user_avatars' に設定
          .upload(filePath, avatarFile, {
            upsert: true, // 既存のファイルがあれば上書き
            cacheControl: '3600',
          });

        if (avatarUpdateError) {
          throw avatarUpdateError;
        }

        // パブリックURLを取得（バケットが公開設定の場合）
        const { data: publicURL} = supabase
          .storage
          .from('user_avatars')
          .getPublicUrl(filePath);

        if (!publicURL) {
          throw ('画像URLを取得できませんでした');
        }

        avatar_url = publicURL.publicUrl;
        setAvatarPreview(avatar_url);
        setUserData({ ...userData, avatar_url: avatar_url })
      }

      // users テーブルの nickname, avatar_url, avatar_path を更新
      const { error: updateError } = await supabase
        .from('users')
        .update({
          nickname: userData.nickname,
          avatar_url: avatar_url,
        })
        .eq('id', userData.id)
        .single();

      if (updateError) {
        throw updateError;
      }

      // 古いアバター画像を削除（デフォルト画像でない場合）
      if (old_avatar_path && old_avatar_path !== "default_avatar.png") { // デフォルト画像のパスを適宜変更
        const { error: deleteError } = await supabase
          .storage
          .from('user_avatars')
          .remove([old_avatar_path]);

        if (deleteError) {
          console.error("古いアバター画像の削除に失敗しました:", deleteError);
          // 必要に応じてエラーハンドリングを追加
        }
      }
      window.location.reload();
    } catch (err: any) {
      console.error("ユーザー情報の更新中にエラーが発生しました:", err);
      setError(err.message || "予期せぬエラーが発生しました。");
    } finally {
    }
  };

  const loadMoreLikedArticles = async (page: number, pageSize: number = 5) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data: likedArticlesData, error: likesError, count: likedArticleCount} = await supabase
    .from("likes")
    .select(`
      article_id,
      articles (
        id,
        title,
        created_at,
        content,
        description,
        image_url,
        article_categories (
          categories (
            name
          )
        )
      )
    `, { count: 'exact' })
    .eq("user_id", user.id)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (likesError) {
    console.error("いいねした記事の取得エラー:", likesError);
    // エラーハンドリングを適切に行う（例: エラーページにリダイレクトなど）
  }

  const likedArticles: ArticleType[] = likedArticlesData
     ? likedArticlesData
      .filter((like): like is typeof like & { articles: NonNullable<typeof like['articles']> } => 
        like.articles !== null && like.articles !== undefined
      )
      .map(like => ({
        id: like.articles.id,
        title: like.articles.title,
        content: like.articles.content,
        image_url: like.articles.image_url,
        description: like.articles.description,
        created_at: like.articles.created_at,
        categories: like.articles.article_categories
          .map(ac => ac.categories?.name)
          .filter((name): name is string => name !== null && name !== undefined),
      }))
  : [];

    const hasMore = likedArticleCount ? likedArticleCount > ((page + 1) * pageSize) : false;

    return { articles: likedArticles, hasMore };
  };
  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const { articles: newArticles, hasMore: newHasMore } = await loadMoreLikedArticles(nextPage);
      setLikedArticles(prevArticles => [...prevArticles, ...newArticles]);
      setHasMore(newHasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("記事の読み込みに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userData,
    setUserData,
    likedArticles,
    handleFileChange,
    handleProfileUpdate,
    handleLoadMore,
    hasMore,
    avatarPreview,
    error,
  };
}
