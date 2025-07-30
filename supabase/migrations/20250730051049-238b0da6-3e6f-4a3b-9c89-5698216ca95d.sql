-- Add missing social network tables

-- User profiles table (if not exists, this extends the existing user system)
CREATE TABLE IF NOT EXISTS public.social_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  header_url TEXT,
  location VARCHAR(100),
  website VARCHAR(200),
  verified BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Followers/Following relationships
CREATE TABLE IF NOT EXISTS public.social_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Post likes
CREATE TABLE IF NOT EXISTS public.social_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Post reposts/retweets
CREATE TABLE IF NOT EXISTS public.social_reposts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  comment TEXT CHECK (char_length(comment) <= 280),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Comments/Replies
CREATE TABLE IF NOT EXISTS public.social_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  parent_comment_id UUID REFERENCES public.social_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hashtags tracking
CREATE TABLE IF NOT EXISTS public.social_hashtags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag VARCHAR(100) NOT NULL UNIQUE,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.social_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'like', 'repost', 'reply', 'follow', 'mention'
  post_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.social_comments(id) ON DELETE CASCADE,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to existing social_posts table
ALTER TABLE public.social_posts 
ADD COLUMN IF NOT EXISTS hashtags TEXT[],
ADD COLUMN IF NOT EXISTS mentions TEXT[],
ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS repost_of_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS reposts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS replies_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- Enable Row Level Security
ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.social_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.social_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.social_profiles;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.social_profiles FOR SELECT USING (true);

CREATE POLICY "Users can create their own profile" 
ON public.social_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.social_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone" 
ON public.social_follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others" 
ON public.social_follows FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON public.social_follows FOR DELETE 
USING (auth.uid() = follower_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" 
ON public.social_post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like posts" 
ON public.social_post_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" 
ON public.social_post_likes FOR DELETE 
USING (auth.uid() = user_id);

-- Reposts policies
CREATE POLICY "Reposts are viewable by everyone" 
ON public.social_reposts FOR SELECT USING (true);

CREATE POLICY "Users can repost" 
ON public.social_reposts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their reposts" 
ON public.social_reposts FOR DELETE 
USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
ON public.social_comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments" 
ON public.social_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.social_comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.social_comments FOR DELETE 
USING (auth.uid() = user_id);

-- Hashtags policies
CREATE POLICY "Hashtags are viewable by everyone" 
ON public.social_hashtags FOR SELECT USING (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.social_notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.social_notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_reply_to_id ON public.social_posts(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_hashtags ON public.social_posts USING GIN(hashtags);
CREATE INDEX IF NOT EXISTS idx_social_follows_follower_id ON public.social_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_social_follows_following_id ON public.social_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_social_post_likes_post_id ON public.social_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_social_post_likes_user_id ON public.social_post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_social_comments_post_id ON public.social_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_social_notifications_user_id ON public.social_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_social_notifications_created_at ON public.social_notifications(created_at DESC);