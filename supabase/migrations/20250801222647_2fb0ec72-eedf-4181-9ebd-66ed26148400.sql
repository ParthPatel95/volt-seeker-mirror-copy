-- Add missing foreign key constraint between social_posts and auth.users
ALTER TABLE public.social_posts 
ADD CONSTRAINT IF NOT EXISTS social_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON public.social_posts(created_at DESC);

-- Enable RLS for social_posts if not already enabled
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can view all posts" ON public.social_posts;
CREATE POLICY "Users can view all posts" 
ON public.social_posts 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create their own posts" ON public.social_posts;
CREATE POLICY "Users can create their own posts" 
ON public.social_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.social_posts;
CREATE POLICY "Users can update their own posts" 
ON public.social_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.social_posts;
CREATE POLICY "Users can delete their own posts" 
ON public.social_posts 
FOR DELETE 
USING (auth.uid() = user_id);