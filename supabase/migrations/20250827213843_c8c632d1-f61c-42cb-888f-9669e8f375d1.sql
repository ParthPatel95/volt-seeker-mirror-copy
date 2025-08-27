-- Fix critical security issues identified by linter and security scan

-- 1. Fix email verification tokens security (CRITICAL)
-- Enable RLS on voltmarket_email_verification_tokens table
ALTER TABLE public.voltmarket_email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "Users can only access their own email verification tokens" ON public.voltmarket_email_verification_tokens;

-- Create secure policy for email verification tokens
CREATE POLICY "Users can only access their own email verification tokens" 
ON public.voltmarket_email_verification_tokens 
FOR ALL 
USING (auth.uid() = user_id);

-- 2. Improve profiles table security
-- Update profiles table policies to be more restrictive
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.profiles;

-- Create more secure policy for profiles - only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Users can still update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Fix social interactions security
-- Enable RLS if not already enabled and create secure policies
ALTER TABLE public.social_post_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all likes" ON public.social_post_likes;

-- Create secure policies for social interactions
CREATE POLICY "Users can view likes on posts" 
ON public.social_post_likes 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own likes" 
ON public.social_post_likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Secure social posts if not already done
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for social posts visibility
CREATE POLICY "Users can view public social posts" 
ON public.social_posts 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  (visibility = 'public' OR user_id = auth.uid())
);

CREATE POLICY "Users can manage their own posts" 
ON public.social_posts 
FOR ALL 
USING (auth.uid() = user_id);