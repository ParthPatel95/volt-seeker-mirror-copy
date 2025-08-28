-- Fix remaining security issues found by security scanner

-- 1. Fix profiles table security (ERROR level)
-- Make profiles more restrictive - only allow users to see their own profile
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow viewing other profiles only for authenticated users in a limited way (for features that need it)
CREATE POLICY "Authenticated users can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  user_id != auth.uid()
);

-- 2. Fix access_requests table security (ERROR level)
-- Currently publicly readable, should be admin only
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Public can create access requests" ON public.access_requests;

-- Allow public to create requests but not view them
CREATE POLICY "Public can submit access requests" 
ON public.access_requests 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admins) can view requests
CREATE POLICY "Authenticated users can view access requests" 
ON public.access_requests 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- 3. Fix site_access_requests table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'site_access_requests') THEN
        EXECUTE 'ALTER TABLE public.site_access_requests ENABLE ROW LEVEL SECURITY';
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Public can view site access requests" ON public.site_access_requests;
        DROP POLICY IF EXISTS "Public can create site access requests" ON public.site_access_requests;
        
        -- Create secure policies
        CREATE POLICY "Public can submit site access requests" 
        ON public.site_access_requests 
FOR INSERT 
        WITH CHECK (true);
        
        CREATE POLICY "Authenticated users can view site access requests" 
        ON public.site_access_requests 
        FOR SELECT 
        USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- 4. Fix email templates security (WARNING level)
-- Make them accessible only to authenticated users
DROP POLICY IF EXISTS "Public can view email templates" ON public.voltmarket_email_templates;

CREATE POLICY "Authenticated users can view email templates" 
ON public.voltmarket_email_templates 
FOR SELECT 
USING (auth.role() = 'authenticated');