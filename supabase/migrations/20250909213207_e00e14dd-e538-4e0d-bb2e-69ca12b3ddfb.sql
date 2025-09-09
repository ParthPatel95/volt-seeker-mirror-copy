-- Fix remaining security issues (avoiding duplicates)

-- 1. Secure voltmarket_listings for competitive data protection
ALTER TABLE voltmarket_listings ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE voltmarket_listings ADD COLUMN IF NOT EXISTS requires_verification BOOLEAN DEFAULT false;

-- Update existing listing policies if they exist
DROP POLICY IF EXISTS "Anyone can view listings" ON voltmarket_listings;
DROP POLICY IF EXISTS "Public can view listings" ON voltmarket_listings;
DROP POLICY IF EXISTS "Users can view public listings" ON voltmarket_listings;

CREATE POLICY "Users can view public listings" 
ON voltmarket_listings FOR SELECT 
USING (
  is_public = true 
  OR auth.uid() = seller_id 
  OR (requires_verification = true AND auth.uid() IS NOT NULL)
);

-- 2. Create security audit log for monitoring
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

-- Only system can manage audit logs
CREATE POLICY "System audit log access" 
ON security_audit_log FOR ALL 
USING (false);