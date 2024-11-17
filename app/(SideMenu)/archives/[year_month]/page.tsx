import YearMonth from "@/features/routes/year_month/components";
import { createClient } from "@/lib/supabase/client/serverClient";
import { ArticleType } from "@/types/article";
import { notFound } from 'next/navigation';
import { parse, isValid, startOfMonth, endOfMonth } from 'date-fns';
import { ITEMS_PER_PAGE, INITIAL_RANGE_START, INITIAL_RANGE_END } from "@/constants/pagination";

export default async function Page({
  params,
}: {
  params: { year_month: string };
}) {
  const supabase = await createClient();
  const { year_month } = params;
  console.log(year_month);
  // year_month が 'YYYY-MM' 形式であることを確認
  const parsedDate = parse(year_month, 'yyyy-MM', new Date());
  if (!isValid(parsedDate) || year_month.length !== 7) {
    notFound();
    return;
  }

  // 指定された月の開始日と終了日を取得
  const startDate = startOfMonth(parsedDate);
  const endDate = endOfMonth(parsedDate);

  // ISO 文字列に変換（例: '2024-05-01T00:00:00.000Z'）
  const startISO = startDate.toISOString();
  const endISO = endDate.toISOString();

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
    .gte('created_at', startISO) // 開始日以上
    .lte('created_at', endISO)   // 終了日以下
    .order('created_at', { ascending: false }) // 作成日時で降順にソート
    .range(INITIAL_RANGE_START, INITIAL_RANGE_END); // 最新5件を取得

  if (error) {
    throw ('記事取得エラー')
  }

  let articles: ArticleType[] = [];
  if (data && data.length > 0) {
    articles = data.map(article => ({
      id: article.id,
      title: article.title,
      content: article.content,
      image_url: article.image_url,
      description: article.description,
      created_at: article.created_at,
      categories: article.article_categories
        .map(ac => ac.categories?.name)
        .filter(Boolean), // 未定義やnullを除外
    }));
  }

  const initialHasMore = count ? count > ITEMS_PER_PAGE : false;

  return <YearMonth articles={articles} heading={year_month} initialHasMore={initialHasMore} />;
}
