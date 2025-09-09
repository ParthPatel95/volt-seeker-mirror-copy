-- Fix remaining critical security issues

-- 1. Check if social_profiles table exists and secure it
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'social_profiles') THEN
        -- Drop any public access policies
        DROP POLICY IF EXISTS "Public can view social profiles" ON social_profiles;
        DROP POLICY IF EXISTS "Anyone can view social profiles" ON social_profiles;
        DROP POLICY IF EXISTS "Social profiles are viewable by everyone" ON social_profiles;
        
        -- Create secure policy requiring authentication
        CREATE POLICY "Authenticated users can view social profiles" 
        ON social_profiles FOR SELECT 
        TO authenticated
        USING (true);
    END IF;
END $$;

-- 2. Secure voltmarket_listings for competitive data protection
-- Add option to make listings private for premium users
ALTER TABLE voltmarket_listings ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE voltmarket_listings ADD COLUMN IF NOT EXISTS requires_verification BOOLEAN DEFAULT false;

-- Update policy to protect sensitive listing data
DROP POLICY IF EXISTS "Anyone can view listings" ON voltmarket_listings;
DROP POLICY IF EXISTS "Public can view listings" ON voltmarket_listings;

CREATE POLICY "Users can view public listings" 
ON voltmarket_listings FOR SELECT 
USING (
  is_public = true 
  OR auth.uid() = seller_id 
  OR (requires_verification = true AND auth.uid() IS NOT NULL)
);

-- 3. Add more granular control to access_requests
CREATE POLICY "Admin can view access requests" 
ON access_requests FOR SELECT 
USING (false); -- This will be managed by admin users only

-- 4. Create audit log for security monitoring
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admin can view audit logs" 
ON security_audit_log FOR SELECT 
USING (false); -- Admin access only