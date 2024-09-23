-- Create articles table
CREATE TABLE public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  micro_cms_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES public.users NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on articles table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles table
CREATE POLICY "Anyone can read published articles" ON public.articles
  FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Authors can CRUD own articles" ON public.articles
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes on articles table
CREATE INDEX idx_articles_micro_cms_id ON public.articles(micro_cms_id);
CREATE INDEX idx_articles_user_id ON public.articles(user_id);
CREATE INDEX idx_articles_published_at ON public.articles(published_at);
