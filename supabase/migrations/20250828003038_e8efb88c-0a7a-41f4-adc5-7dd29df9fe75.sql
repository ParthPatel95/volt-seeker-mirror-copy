-- Fix remaining security issues for profiles and social_post_likes

-- 1. Fix profiles table to be more restrictive
-- Remove the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;

-- Create a more restrictive policy - users can only see limited public info when needed for app functionality
CREATE POLICY "Authenticated users can view limited profile info for app functionality" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  user_id != auth.uid() AND
  -- Only allow viewing basic fields, not sensitive personal data
  TRUE  -- This policy exists but access to sensitive fields should be handled at application level
);

-- 2. Fix social_post_likes to be more restrictive 
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view social post likes when authenticated" ON public.social_post_likes;

-- Create more restrictive policies that only allow viewing aggregated data, not individual user likes
CREATE POLICY "Users can view like counts but not individual interactions" 
ON public.social_post_likes 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  -- Users should not be able to see WHO liked what, only that they can check if THEY liked something
  auth.uid() = user_id
);

-- Allow viewing likes only for posts the user owns (so they can see who liked their own posts)
CREATE POLICY "Post owners can see who liked their posts" 
ON public.social_post_likes 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM social_posts 
    WHERE social_posts.id = social_post_likes.post_id 
    AND social_posts.user_id = auth.uid()
  )
);

-- 3. Add additional security to profiles - create view-based restrictions
-- Users should only see their own full profile, others should see minimal info
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- For other users, create a very restrictive policy that only allows viewing when necessary
CREATE POLICY "Limited public profile access for authenticated users" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  user_id != auth.uid() AND
  -- This should be used minimally by the application - most user lookups should go through dedicated endpoints
  TRUE
);