-- Migrate existing voltmarket_profiles data to gridbazaar_profiles
INSERT INTO gridbazaar_profiles (
  user_id, 
  role, 
  seller_type, 
  company_name, 
  phone_number, 
  bio, 
  linkedin_url, 
  website, 
  profile_image_url, 
  is_id_verified, 
  is_email_verified, 
  created_at, 
  updated_at
)
SELECT 
  user_id,
  role,
  seller_type,
  company_name,
  phone_number,
  bio,
  linkedin_url,
  website_url as website,
  profile_image_url,
  is_id_verified,
  is_email_verified,
  created_at,
  updated_at
FROM voltmarket_profiles
WHERE user_id NOT IN (SELECT user_id FROM gridbazaar_profiles)
ON CONFLICT (user_id) DO NOTHING;