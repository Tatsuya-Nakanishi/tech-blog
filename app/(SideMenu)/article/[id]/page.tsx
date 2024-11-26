import ArticleDetail from '@/features/routes/article/id/components/index';
import { ArticleType } from '@/types/article';
import { CommentType } from '@/types/comment';
import { createClient } from '@/lib/supabase/client/serverClient';
import { notFound } from 'next/navigation';
import { UserType } from '@/types/user';

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;
  const { data: articleData, error } = await supabase
    .from('articles')
    .select(
      `
    id,
    title,
    content,
    image_url,
    description,
    created_at,
    article_categories!inner (
      categories!inner (
        name
      )
    ),
    likes: likes(count)
  `
    )
    .eq('id', id)
    .single();

  if (error) {
    throw error.message;
  }

  if (!articleData) {
    notFound();
  }

  const article: ArticleType = {
    id: articleData.id,
    title: articleData.title,
    content: articleData.content,
    image_url: articleData.image_url,
    description: articleData.description,
    created_at: articleData.created_at,
    categories: articleData.article_categories
      .map((ac) => ac.categories?.name)
      .filter(Boolean), // カテゴリー名を配列として取得し、null や undefined を除外
  };

  const initialLikes = articleData.likes[0].count;

  // コメントとユーザー情報を取得
  const { data: commentsData, error: commentsError } = await supabase
    .from('comments')
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      users!inner (
        id,
        nickname,
        avatar_url
      )
    `
    )
    .eq('article_id', id)
    .order('created_at', { ascending: true });
  console.log(commentsData);

  const initialComments: CommentType[] = commentsData
    ? commentsData
        .filter(
          (
            comment
          ): comment is NonNullable<typeof comment> & {
            users: NonNullable<(typeof comment)['users']>;
          } => comment !== null
        )
        .map((comment) => ({
          id: comment.id,
          author: comment.users?.nickname || '匿名',
          avatar: comment.users?.avatar_url || '/placeholder.svg',
          userId: comment.user_id,
          date: new Date(comment.created_at).toLocaleDateString(),
          content: comment.content,
        }))
    : [];

  if (commentsError) {
    console.error('コメントの取得エラー:', commentsError.message);
    // エラーハンドリングを適切に行う
  }

  const { data: authData } = await supabase.auth.getUser();
  const auth = authData?.user;
  let user: UserType | null = null;
  let isLiked = false;

  if (auth) {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', auth.id)
      .single();

    if (profileError) {
      console.error('ユーザープロファイルの取得エラー:', profileError.message);
      // 必要に応じてエラーハンドリングを追加
    } else {
      user = profile;
      // ユーザーがいいね済みかどうかを確認
      const { data: likeData, error: likeError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', auth.id)
        .eq('article_id', id)
        .single();

      if (likeError && likeError.code !== 'PGRST116') {
        console.error('いいね状態の取得エラー:', likeError.message);
      } else {
        isLiked = !!likeData;
      }
    }
  }

  return (
    <ArticleDetail
      article={article}
      initialLikes={initialLikes}
      initialComments={initialComments}
      user={user}
      isLiked={isLiked}
    />
  );
}
