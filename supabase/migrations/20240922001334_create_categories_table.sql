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
