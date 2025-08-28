-- Fix the critical security issues with correct syntax
-- Fix email verification tokens security (most critical)

-- Enable RLS if not already enabled
ALTER TABLE public.voltmarket_email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies with correct access controls
DROP POLICY IF EXISTS "Service role can manage verification tokens" ON public.voltmarket_email_verification_tokens;
DROP POLICY IF EXISTS "Users can view their own verification tokens" ON public.voltmarket_email_verification_tokens;

-- Create secure policies for email verification tokens
CREATE POLICY "Users can access their own email verification tokens" 
ON public.voltmarket_email_verification_tokens 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all verification tokens" 
ON public.voltmarket_email_verification_tokens 
FOR ALL 
USING (auth.role() = 'service_role');

-- Fix social_post_likes table if it exists
-- First check and enable RLS
DO $$ 
BEGIN
    -- Check if table exists before altering
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'social_post_likes') THEN
        EXECUTE 'ALTER TABLE public.social_post_likes ENABLE ROW LEVEL SECURITY';
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Users can view likes on posts" ON public.social_post_likes;
        DROP POLICY IF EXISTS "Users can view all likes" ON public.social_post_likes;
        
        -- Create secure policies
        CREATE POLICY "Users can view social post likes when authenticated" 
        ON public.social_post_likes 
        FOR SELECT 
        USING (auth.role() = 'authenticated');
        
        CREATE POLICY "Users can create their own likes" 
        ON public.social_post_likes 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own likes" 
        ON public.social_post_likes 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;