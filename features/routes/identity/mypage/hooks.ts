"use client";

import { useState, useCallback, useRef } from "react";
import { ArticleType } from "@/types/article";
import { UserType } from "@/types/user";
import { createClient } from "@/lib/supabase/client/browserClient";
import { useRouter } from 'next/navigation';

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
  const supabase = createClient();
  // supabase.storage;
  const [userData, setUserData] = useState<UserType>(user);
  const [email, setEmail] = useState<string>(user.email);
  const [nickname, setNickName] = useState<string>(user?.nickname || '');
  const [likedArticles, setLikedArticles] =
    useState<ArticleType[]>(initialLikedArticles);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userData?.avatar_url || null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

  const handleUpdate = useCallback(async () => {
    setIsUpdating(true);
    setError(null);

    try {
      let avatar_url = userData.avatar_url;
      let new_avatar_path: string | null = null;
      let old_avatar_path: string | null = userData.avatar_url || null;

      // 新しいアバター画像が選択されている場合、Supabase Storage にアップロード
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userData.id}-${Date.now()}.${fileExt}`;
        const filePath = `${userData.id}/${fileName}`;

        // 画像をアップロード
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('user_avatars') // バケット名を 'user_avatars' に設定
          .upload(filePath, avatarFile, {
            upsert: true, // 既存のファイルがあれば上書き
            cacheControl: '3600',
          });

        if (uploadError) {
          throw uploadError;
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
        new_avatar_path = filePath;
      }

      // users テーブルの nickname, avatar_url, avatar_path を更新
      const { data: updateData, error: updateError } = await supabase
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
      //router.prefetch("/identity/mypage");
      window.location.reload()
      // ローカルのユーザーデータを更新
      setUserData(updateData);
      setAvatarFile(null); // アップロード後にファイルをリセット
    } catch (err: any) {
      console.error("ユーザー情報の更新中にエラーが発生しました:", err);
      setError(err.message || "予期せぬエラーが発生しました。");
    } finally {
      setIsUpdating(false);
    }
  }, [supabase, userData, avatarFile]);

  const handleLoadMore = () => {
    setLikedArticles((prevArticles) => [...prevArticles, ...addArticles]);
    setHasLoadedMore(true);
  };

  return {
    userData,
    setUserData,
    likedArticles,
    handleFileChange,
    handleUpdate,
    handleLoadMore,
    hasLoadedMore,
    avatarPreview,
    isUpdating,
    error,
  };
}
