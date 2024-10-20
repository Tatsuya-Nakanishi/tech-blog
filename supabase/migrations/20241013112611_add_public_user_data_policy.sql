-- This migration adds a policy to allow anyone to view public user data
-- and grants SELECT permission on specific columns

-- Enable RLS on the users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to view public user data
CREATE POLICY "誰でもユーザーの公開データを閲覧可能" ON public.users
FOR SELECT
USING (true);

-- Grant SELECT permission on specific columns to authenticated and anonymous users
GRANT SELECT (id, nickname, avatar_url) ON public.users TO authenticated, anon;

-- Revert changes if needed
-- CREATE OR REPLACE FUNCTION revert_changes()
-- RETURNS void AS $$
-- BEGIN
--     -- Remove the policy
--     DROP POLICY IF EXISTS "誰でもユーザーの公開データを閲覧可能" ON public.users;
    
--     -- Revoke SELECT permissions
--     REVOKE SELECT (id, nickname, avatar_url) ON public.users FROM authenticated, anon;
-- END;
-- $$ LANGUAGE plpgsql;

-- Uncomment the following line to revert changes
-- SELECT revert_changes();