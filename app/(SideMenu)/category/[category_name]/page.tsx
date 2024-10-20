import CategoryName from "@/features/routes/category/category_name/components/index";
import { createClient } from "@/lib/supabase/client/serverClient";
import { ArticleType } from "@/types/article";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { category_name: string };
}) {
  const supabase = createClient();
  const { category_name } = params;
  const decodeName = decodeURIComponent(category_name);

  const { data, error, count} = await supabase
  .from('articles')
  .select(`
    id,
    title,
    content,
    image_url,
    description,
    created_at,
    article_categories!inner (
      categories!inner (
        id, 
        name
      )
    )
  `, { count: 'exact' })
  .eq('article_categories.categories.name', decodeName)
  .order('created_at', { ascending: false })
  .range(0, 4);

  if (error) {
    throw (error.message);
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

  const initialHasMore = count ? count > (1 * 5) : false;

  return <CategoryName articles={articles} heading={decodeName} initialHasMore={initialHasMore} />;
}