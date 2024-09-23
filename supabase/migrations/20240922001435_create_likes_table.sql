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
