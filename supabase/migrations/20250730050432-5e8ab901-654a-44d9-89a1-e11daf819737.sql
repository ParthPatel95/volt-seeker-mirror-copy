-- Create social network database schema

-- User profiles table (extends auth.users)
CREATE TABLE public.social_profiles (
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

-- Social posts table
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  media_urls TEXT[],
  hashtags TEXT[],
  mentions TEXT[],
  reply_to_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  repost_of_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  reposts_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Followers/Following relationships
CREATE TABLE public.social_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Post likes
CREATE TABLE public.social_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Post reposts/retweets
CREATE TABLE public.social_reposts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  comment TEXT CHECK (char_length(comment) <= 280),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Hashtags tracking
CREATE TABLE public.social_hashtags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag VARCHAR(100) NOT NULL UNIQUE,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE public.social_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'like', 'repost', 'reply', 'follow', 'mention'
  post_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.social_profiles FOR SELECT USING (true);

CREATE POLICY "Users can create their own profile" 
ON public.social_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.social_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" 
ON public.social_posts FOR SELECT USING (true);

CREATE POLICY "Users can create posts" 
ON public.social_posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.social_posts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.social_posts FOR DELETE 
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

-- Hashtags policies
CREATE POLICY "Hashtags are viewable by everyone" 
ON public.social_hashtags FOR SELECT USING (true);

CREATE POLICY "Service role can manage hashtags" 
ON public.social_hashtags FOR ALL 
USING (current_setting('role') = 'service_role');

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.social_notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.social_notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can create notifications" 
ON public.social_notifications FOR INSERT 
WITH CHECK (current_setting('role') = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX idx_social_posts_reply_to_id ON public.social_posts(reply_to_id);
CREATE INDEX idx_social_posts_hashtags ON public.social_posts USING GIN(hashtags);
CREATE INDEX idx_social_follows_follower_id ON public.social_follows(follower_id);
CREATE INDEX idx_social_follows_following_id ON public.social_follows(following_id);
CREATE INDEX idx_social_post_likes_post_id ON public.social_post_likes(post_id);
CREATE INDEX idx_social_post_likes_user_id ON public.social_post_likes(user_id);
CREATE INDEX idx_social_notifications_user_id ON public.social_notifications(user_id);
CREATE INDEX idx_social_notifications_created_at ON public.social_notifications(created_at DESC);

-- Create functions for updating counts
CREATE OR REPLACE FUNCTION update_social_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update posts count
  IF TG_TABLE_NAME = 'social_posts' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.social_profiles 
      SET posts_count = posts_count + 1 
      WHERE user_id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.social_profiles 
      SET posts_count = posts_count - 1 
      WHERE user_id = OLD.user_id;
    END IF;
  END IF;

  -- Update likes count
  IF TG_TABLE_NAME = 'social_post_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.social_posts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.social_posts 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.post_id;
    END IF;
  END IF;

  -- Update reposts count
  IF TG_TABLE_NAME = 'social_reposts' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.social_posts 
      SET reposts_count = reposts_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.social_posts 
      SET reposts_count = reposts_count - 1 
      WHERE id = OLD.post_id;
    END IF;
  END IF;

  -- Update followers/following count
  IF TG_TABLE_NAME = 'social_follows' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.social_profiles 
      SET followers_count = followers_count + 1 
      WHERE user_id = NEW.following_id;
      UPDATE public.social_profiles 
      SET following_count = following_count + 1 
      WHERE user_id = NEW.follower_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.social_profiles 
      SET followers_count = followers_count - 1 
      WHERE user_id = OLD.following_id;
      UPDATE public.social_profiles 
      SET following_count = following_count - 1 
      WHERE user_id = OLD.follower_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_social_posts_count 
  AFTER INSERT OR DELETE ON public.social_posts 
  FOR EACH ROW EXECUTE FUNCTION update_social_counts();

CREATE TRIGGER update_social_likes_count 
  AFTER INSERT OR DELETE ON public.social_post_likes 
  FOR EACH ROW EXECUTE FUNCTION update_social_counts();

CREATE TRIGGER update_social_reposts_count 
  AFTER INSERT OR DELETE ON public.social_reposts 
  FOR EACH ROW EXECUTE FUNCTION update_social_counts();

CREATE TRIGGER update_social_follows_count 
  AFTER INSERT OR DELETE ON public.social_follows 
  FOR EACH ROW EXECUTE FUNCTION update_social_counts();

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_social_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_social_profiles_updated_at
  BEFORE UPDATE ON public.social_profiles
  FOR EACH ROW EXECUTE FUNCTION update_social_updated_at();

CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW EXECUTE FUNCTION update_social_updated_at();