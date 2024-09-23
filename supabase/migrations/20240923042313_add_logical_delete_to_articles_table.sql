-- Add is_deleted column for logical deletion
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE NOT NULL;

-- Remove RLS policy that depends on user_id
DROP POLICY IF EXISTS "Authors can CRUD own articles" ON public.articles;

-- Remove foreign key constraint on user_id
ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_user_id_fkey;

-- Remove user_id column
ALTER TABLE public.articles
  DROP COLUMN IF EXISTS user_id;

-- Add image_url and description columns
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Modify existing "Anyone can read published articles" policy
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;

CREATE POLICY "Anyone can read published and not deleted articles" ON public.articles
  FOR SELECT
  USING (published_at IS NOT NULL AND is_deleted = FALSE);

-- Optionally, create a new policy to allow certain roles to manage articles
-- Example: Allow authenticated users to update articles (e.g., mark as deleted)
CREATE POLICY "Authenticated users can update articles" ON public.articles
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Prevent physical deletion of articles
CREATE POLICY "Prevent physical deletion of articles" ON public.articles
  FOR DELETE
  TO PUBLIC
  USING (FALSE);

-- Create indexes on new columns if necessary
CREATE INDEX IF NOT EXISTS idx_articles_is_deleted ON public.articles(is_deleted);
CREATE INDEX IF NOT EXISTS idx_articles_image_url ON public.articles(image_url);
CREATE INDEX IF NOT EXISTS idx_articles_description ON public.articles(description);
