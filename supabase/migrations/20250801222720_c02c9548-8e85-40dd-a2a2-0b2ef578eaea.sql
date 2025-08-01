-- Check if foreign key already exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'social_posts_user_id_fkey' 
                   AND table_name = 'social_posts') THEN
        ALTER TABLE public.social_posts 
        ADD CONSTRAINT social_posts_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update the edge function to get user information from the existing profiles table
-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_notifications_from_user_id ON public.social_notifications(from_user_id);

-- Enable RLS on all social tables
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_reposts ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for social_posts
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

-- Policies for social_notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.social_notifications;
CREATE POLICY "Users can view their own notifications" 
ON public.social_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create notifications" ON public.social_notifications;
CREATE POLICY "Users can create notifications" 
ON public.social_notifications 
FOR INSERT 
WITH CHECK (true);

-- Policies for social_follows
DROP POLICY IF EXISTS "Users can view all follows" ON public.social_follows;
CREATE POLICY "Users can view all follows" 
ON public.social_follows 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON public.social_follows;
CREATE POLICY "Users can follow others" 
ON public.social_follows 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON public.social_follows;
CREATE POLICY "Users can unfollow" 
ON public.social_follows 
FOR DELETE 
USING (auth.uid() = follower_id);

-- Policies for social_post_likes
DROP POLICY IF EXISTS "Users can view all likes" ON public.social_post_likes;
CREATE POLICY "Users can view all likes" 
ON public.social_post_likes 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can like posts" ON public.social_post_likes;
CREATE POLICY "Users can like posts" 
ON public.social_post_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON public.social_post_likes;
CREATE POLICY "Users can unlike posts" 
ON public.social_post_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for social_comments
DROP POLICY IF EXISTS "Users can view all comments" ON public.social_comments;
CREATE POLICY "Users can view all comments" 
ON public.social_comments 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.social_comments;
CREATE POLICY "Users can create comments" 
ON public.social_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.social_comments;
CREATE POLICY "Users can update their own comments" 
ON public.social_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.social_comments;
CREATE POLICY "Users can delete their own comments" 
ON public.social_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for social_reposts
DROP POLICY IF EXISTS "Users can view all reposts" ON public.social_reposts;
CREATE POLICY "Users can view all reposts" 
ON public.social_reposts 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create reposts" ON public.social_reposts;
CREATE POLICY "Users can create reposts" 
ON public.social_reposts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reposts" ON public.social_reposts;
CREATE POLICY "Users can delete their own reposts" 
ON public.social_reposts 
FOR DELETE 
USING (auth.uid() = user_id);