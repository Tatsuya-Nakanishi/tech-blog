import type { BlogListResponse } from "@/types/microcmsBlog";
import { fetchBlogs } from "@/lib/microcms/actions/getBlogs";
import { createClient } from "@/lib/supabase/client/browserClient";
export const revalidate = 0;

export async function GET(request: Request) {
  const supabase = createClient();
  try {
    // 1. microCMSから記事を全件取得
    const microCMSResponse: BlogListResponse = await fetchBlogs();
    const fetchedBlogs = microCMSResponse.contents;

    // 2. カテゴリーの処理
    // - カテゴリーを一意に抽出
    const categoriesMap: { [key: string]: string } = {}; // id: name
    fetchedBlogs.forEach((blog) => {
      blog.category.forEach((cat) => {
        categoriesMap[cat.id] = cat.name;
      });
    });

    const categories = Object.keys(categoriesMap).map((id) => ({
      name: categoriesMap[id],
      created_at: new Date().toISOString(),
    }));

    // カテゴリをアップサート（挿入のみ）
    // 既存の名前がない場合のみ挿入するために、insert with ignoreDuplicates
    const { error: categoriesError } = await supabase
      .from("categories")
      .upsert(categories, { onConflict: "name", ignoreDuplicates: true });

    if (categoriesError) {
      console.error("カテゴリのアップサートエラー:", categoriesError);
      throw categoriesError;
    }

    // カテゴリーを取得
    const { data: categoriesData, error: fetchCategoriesError } = await supabase
      .from("categories")
      .select("id, name");

    if (fetchCategoriesError) {
      console.error("カテゴリの取得エラー:", fetchCategoriesError);
      throw fetchCategoriesError;
    }

    const categoryNameToIdMap: { [key: string]: string } = {};
    categoriesData?.forEach((cat) => {
      categoryNameToIdMap[cat.name] = cat.id;
    });

    // 4. 記事の処理
    const articles = fetchedBlogs.map((blog) => ({
      micro_cms_id: blog.id,
      title: blog.title,
      content: blog.content,
      image_url: blog.eyecatch?.url || null,
      description: blog.description || null,
      published_at: String(blog.publishedAt),
      is_deleted: false,
      created_at: String(blog.createdAt),
      updated_at: String(blog.updatedAt),
    }));

    // Supabaseで記事をアップサート（挿入または更新）
    const { error: articlesError } = await supabase
      .from("articles")
      .upsert(articles, { onConflict: "micro_cms_id" });

    if (articlesError) {
      console.error("記事のアップサートエラー:", articlesError);
      throw articlesError;
    }

    // 6. article_categoriesの処理
    // まず、記事のIDを取得
    const { data: articlesDataFetched, error: fetchArticlesError } =
      await supabase.from("articles").select("id, micro_cms_id");

    if (fetchArticlesError) {
      console.error("記事の取得エラー:", fetchArticlesError);
      throw fetchArticlesError;
    }

    const articlesMap: { [key: string]: string } = {}; // micro_cms_id: article_id
    articlesDataFetched?.forEach((article) => {
      articlesMap[article.micro_cms_id] = article.id;
    });

    // article_categories のアップサート用データを作成
    const articleCategories: {
      article_id: string;
      category_id: string;
      created_at?: string;
    }[] = [];
    fetchedBlogs.forEach((blog) => {
      const articleId = articlesMap[blog.id];
      if (articleId) {
        blog.category.forEach((cat) => {
          const categoryId = categoryNameToIdMap[cat.name];
          if (categoryId) {
            articleCategories.push({
              article_id: articleId,
              category_id: categoryId,
              created_at: new Date().toISOString(),
            });
          } else {
            console.warn(
              `Category name "${cat.name}" not found in categories table.`
            );
          }
        });
      }
    });

    // 重複を避けるために一意にする
    const uniqueArticleCategories = Array.from(
      new Set(
        articleCategories.map((ac) => `${ac.article_id}_${ac.category_id}`)
      )
    ).map((uniqueKey) => {
      const [article_id, category_id] = uniqueKey.split("_");
      return {
        article_id,
        category_id,
        created_at: new Date().toISOString(),
      };
    });

    // Supabaseでarticle_categoriesをアップサート（挿入のみ）
    const { error: articleCategoriesError } = await supabase
      .from("article_categories")
      .upsert(uniqueArticleCategories, {
        onConflict: "article_id,category_id", // 文字列形式に変更
      });

    if (articleCategoriesError) {
      console.error(
        "article_categoriesのアップサートエラー:",
        articleCategoriesError
      );
      throw articleCategoriesError;
    }

    // 6. 論理削除: microCMSから取得した記事に存在しない記事を削除フラグを立てる
    const microCMSIds = fetchedBlogs.map((blog) => blog.id);
    const { error: softDeleteError } = await supabase
      .from("articles")
      .update({ is_deleted: true })
      .not(
        "micro_cms_id",
        "in",
        `(${microCMSIds.map((id) => `${id}`).join(",")})`
      )
      .neq("is_deleted", true); // 既に削除されていないものだけ更新

    if (softDeleteError) {
      console.error("論理削除エラー:", softDeleteError);
      throw softDeleteError;
    }

    // 更新: micro_cms_id が microCMSIds に含まれるレコードの is_deleted を false に設定
    const { error: unsoftDeleteError } = await supabase
      .from("articles")
      .update({ is_deleted: false })
      .in("micro_cms_id", microCMSIds)
      .neq("is_deleted", false); // 既に false でないものだけ更新

    if (unsoftDeleteError) {
      console.error("論理削除解除エラー:", unsoftDeleteError);
      throw unsoftDeleteError;
    }

    return new Response("Sync completed successfully", { status: 200 });
  } catch (error) {
    console.error("Sync error:", error);
    return new Response("Sync failed", { status: 500 });
  }
}
