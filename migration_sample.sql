-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create index on users table
CREATE INDEX idx_users_email ON public.users(email);

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

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for categories table
CREATE POLICY "Anyone can read categories" ON public.categories
  FOR SELECT USING (true);

-- Create index on categories table
CREATE INDEX idx_categories_name ON public.categories(name);

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

-- Create likes table
CREATE TABLE public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  article_id UUID REFERENCES public.articles NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, article_id)
);

-- Enable RLS on likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes table
CREATE POLICY "Users can create likes" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read likes" ON public.likes
  FOR SELECT USING (true);

-- Create indexes on likes table
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_article_id ON public.likes(article_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users NOT NULL,
  article_id UUID REFERENCES public.articles NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments table
CREATE POLICY "Anyone can read comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes on comments table
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_article_id ON public.comments(article_id);