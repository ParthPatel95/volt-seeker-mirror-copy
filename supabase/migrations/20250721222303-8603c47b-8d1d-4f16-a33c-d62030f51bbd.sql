-- Migrate existing voltmarket_profiles data to gridbazaar_profiles
INSERT INTO gridbazaar_profiles (
  user_id, 
  role, 
  company_name, 
  phone_number, 
  linkedin_url, 
  website, 
  is_id_verified, 
  is_email_verified, 
  created_at, 
  updated_at
)
SELECT 
  user_id,
  COALESCE(role, 'buyer') as role,
  company_name,
  phone as phone_number,
  linkedin_url,
  website_url as website,
  COALESCE(is_id_verified, false) as is_id_verified,
  COALESCE(is_email_verified, false) as is_email_verified,
  created_at,
  updated_at
FROM voltmarket_profiles
WHERE user_id NOT IN (SELECT user_id FROM gridbazaar_profiles);