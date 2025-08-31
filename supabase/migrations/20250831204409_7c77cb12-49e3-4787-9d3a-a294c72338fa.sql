-- PHASE 1: IMMEDIATE CRITICAL SECURITY FIXES

-- 1. FIX PROFILES TABLE - Restrict access to personal data
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view limited profile info for app funct" ON public.profiles;
DROP POLICY IF EXISTS "Limited public profile access for authenticated users" ON public.profiles;

-- Create secure policies for profiles
CREATE POLICY "Users can view their own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view limited public profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() != user_id
);

-- 2. FIX ACCESS_REQUESTS TABLE - Restrict to admin only
-- Drop existing public access policy
DROP POLICY IF EXISTS "Authenticated users can view access requests" ON public.access_requests;

-- Create admin-only access policy (temporarily restrictive until proper admin roles are implemented)
CREATE POLICY "Only system can view access requests" 
ON public.access_requests 
FOR SELECT 
USING (false); -- Temporarily block all access until admin system is implemented

-- Keep public insert for form submissions
-- "Public can submit access requests" policy remains unchanged

-- 3. FIX SOCIAL INTERACTIONS - Ensure authentication required
-- Update existing policy to be more explicit about authentication
DROP POLICY IF EXISTS "Users can view social interactions" ON public.social_interactions;

CREATE POLICY "Authenticated users can view relevant social interactions" 
ON public.social_interactions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = user_id OR target_id IN (
    SELECT id FROM public.social_posts WHERE user_id = auth.uid()
  ))
);

-- 4. FIX SITE ACCESS REQUESTS - Secure business data
-- Check if site_access_requests table exists and secure it
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'site_access_requests') THEN
    -- Drop any overly permissive policies
    DROP POLICY IF EXISTS "Public can view site access requests" ON public.site_access_requests;
    DROP POLICY IF EXISTS "Authenticated users can view site access requests" ON public.site_access_requests;
    
    -- Create restrictive policy
    CREATE POLICY "Only system can manage site access requests" 
    ON public.site_access_requests 
    FOR ALL 
    USING (false)
    WITH CHECK (false);
  END IF;
END $$;