import Top from "@/features/routes/top/components/index";
import { createClient } from "@/lib/supabase/client/serverClient";
import {ITEMS_PER_PAGE, INITIAL_RANGE_START, INITIAL_RANGE_END} from "@/constants/pagination";

export default async function Page() {
  const supabase = createClient();
  // articles と関連する article_categories と categories を取得
  const { data, error, count } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      content,
      image_url,
      description,
      created_at,
      article_categories (
        categories (name)
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false }) // 作成日時で降順にソート
    .range(INITIAL_RANGE_START, INITIAL_RANGE_END);

  if (error) {
    throw ('記事取得エラー')
  }

  // データを整形してカテゴリ名の配列を作成
  const articles = data.map(article => ({
    id: article.id,
    title: article.title,
    content: article.content,
    image_url: article.image_url,
    description: article.description,
    created_at: article.created_at,
    categories: article.article_categories
      .map(ac => ac.categories?.name)
      .filter(Boolean) // 未定義やnullを除外
  }));

  const initialHasMore = count ? count > ITEMS_PER_PAGE : false;

  return (
    <Top articles={articles} heading="最新の記事" initialHasMore={initialHasMore} />
  );
}
