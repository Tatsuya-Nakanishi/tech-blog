import React from "react";
import SideMenu from "@/features/common/SideMenu/components";
import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client/serverClient";
import { format } from 'date-fns';

type LayoutProps = {
  children: ReactNode;
};

export default async function Layout({ children }: LayoutProps)  {
  const supabase = createClient();
  
  const { data: categories, error: categoryNamesError } = await supabase
    .from('categories')
    .select('name');
  if (categoryNamesError) {
    throw ('カテゴリー取得エラー');
  }

  const { data: articles, error: archivesError } = await supabase
    .from('articles')
    .select('created_at')
    .order('created_at');

  if (archivesError) {
    throw ('アーカイブ取得エラー');
  }

  const archives: string[] = [];

  articles?.forEach(article => {
    if (article.created_at) {
      const formattedDate = format(new Date(article.created_at), 'yyyy-MM');
      if (!archives.includes(formattedDate)) {
        archives.push(formattedDate);
      }
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto flex-grow p-4 md:flex md:space-x-4">
          {children}
        <SideMenu categories={categories} archives={archives} />
      </main>
    </div>
  );
};