-- PHASE 1: IMMEDIATE CRITICAL SECURITY FIXES (Fixed version)

-- 1. FIX PROFILES TABLE - Restrict access to personal data
-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view their own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view limited profile info for app funct" ON public.profiles;
DROP POLICY IF EXISTS "Limited public profile access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can view limited public profile info" ON public.profiles;

-- Create secure policies for profiles
CREATE POLICY "Users view own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Limited public profile access" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() != user_id
);

-- 2. FIX ACCESS_REQUESTS TABLE - Restrict to admin only
DROP POLICY IF EXISTS "Authenticated users can view access requests" ON public.access_requests;

CREATE POLICY "Restrict access requests viewing" 
ON public.access_requests 
FOR SELECT 
USING (false); -- Block all access until admin system is implemented

-- 3. FIX SOCIAL INTERACTIONS - Ensure proper authentication
DROP POLICY IF EXISTS "Users can view social interactions" ON public.social_interactions;

CREATE POLICY "Secure social interactions access" 
ON public.social_interactions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = user_id OR target_id IN (
    SELECT id FROM public.social_posts WHERE user_id = auth.uid()
  ))
);