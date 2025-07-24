-- Create social posts table
CREATE TABLE public.voltmarket_social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'listing_announcement', 'market_insight'
  related_listing_id UUID,
  hashtags TEXT[],
  media_urls TEXT[],
  visibility TEXT NOT NULL DEFAULT 'public', -- 'public', 'followers', 'private'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create follows table
CREATE TABLE public.voltmarket_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create social interactions table
CREATE TABLE public.voltmarket_social_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  interaction_type TEXT NOT NULL, -- 'like', 'comment', 'share'
  content TEXT, -- for comments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.voltmarket_social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voltmarket_social_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for social posts
CREATE POLICY "Public posts are viewable by everyone" 
ON public.voltmarket_social_posts 
FOR SELECT 
USING (visibility = 'public');

CREATE POLICY "Users can view their own posts" 
ON public.voltmarket_social_posts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view posts from people they follow" 
ON public.voltmarket_social_posts 
FOR SELECT 
USING (
  visibility = 'followers' AND 
  user_id IN (
    SELECT following_id FROM public.voltmarket_follows 
    WHERE follower_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own posts" 
ON public.voltmarket_social_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.voltmarket_social_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.voltmarket_social_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for follows
CREATE POLICY "Users can view all follows" 
ON public.voltmarket_follows 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create follows" 
ON public.voltmarket_follows 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" 
ON public.voltmarket_follows 
FOR DELETE 
USING (auth.uid() = follower_id);

-- Create policies for social interactions
CREATE POLICY "Users can view all interactions" 
ON public.voltmarket_social_interactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create interactions" 
ON public.voltmarket_social_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" 
ON public.voltmarket_social_interactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" 
ON public.voltmarket_social_interactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_voltmarket_social_posts_updated_at
BEFORE UPDATE ON public.voltmarket_social_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();