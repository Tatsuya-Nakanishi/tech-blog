-- Create article_categories table
CREATE TABLE public.article_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES public.articles NOT NULL,
  category_id UUID REFERENCES public.categories NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(article_id, category_id)
);

-- Enable RLS on article_categories table
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for article_categories table
CREATE POLICY "Anyone can read article categories" ON public.article_categories
  FOR SELECT USING (true);

-- Create indexes on article_categories table
CREATE INDEX idx_article_categories_article_id ON public.article_categories(article_id);
CREATE INDEX idx_article_categories_category_id ON public.article_categories(category_id);
