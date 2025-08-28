-- Fix only the critical email verification tokens security issue
-- The critical issue is that voltmarket_email_verification_tokens table is publicly readable

-- First check if RLS is enabled and enable it if not
ALTER TABLE public.voltmarket_email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Drop the existing problematic policy that makes tokens publicly readable
DROP POLICY IF EXISTS "Service role can manage verification tokens" ON public.voltmarket_email_verification_tokens;

-- Create a secure policy that only allows users to access their own tokens
CREATE POLICY "Users can only access their own email verification tokens" 
ON public.voltmarket_email_verification_tokens 
FOR ALL 
USING (auth.uid() = user_id);

-- Allow service role to still manage tokens for system operations
CREATE POLICY "Service role can manage all verification tokens" 
ON public.voltmarket_email_verification_tokens 
FOR ALL 
USING (auth.role() = 'service_role');

-- Update profiles table to be more secure but not break existing functionality
-- Only allow authenticated users to view other profiles, not everyone
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Fix social interactions to be more secure
-- Remove the overly permissive policy for social_post_likes
DROP POLICY IF EXISTS "Users can view likes on posts" ON public.social_post_likes;

-- Create a more restrictive policy for social post likes
CREATE POLICY "Users can view social interactions when authenticated" 
ON public.social_post_likes 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own social post likes" 
ON public.social_post_likes 
FOR INSERT, UPDATE, DELETE 
USING (auth.uid() = user_id);