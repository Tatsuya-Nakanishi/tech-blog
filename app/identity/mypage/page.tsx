import MyPage from "@/features/routes/identity/mypage/components/index";
import { ArticleType } from "@/types/article";
import { createClient } from "@/lib/supabase/client/serverClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const auth = data?.user;
  if (!auth) {
    redirect("/login");
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", auth.id)
    .single();

  if (!user || userError) {
    redirect("/login");
  }
  // いいねした記事を取得
  const { data: likedArticlesData, error: likesError, count: likedArticleCount } = await supabase
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
    .eq("user_id", auth.id)
    .order('created_at', { ascending: false })
    .range(0, 4);
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

  const initialHasMore = likedArticleCount ? likedArticleCount > (1 * 5) : false;

  return <MyPage likedArticles={likedArticles} user={user} initialHasMore={initialHasMore} />;
}
