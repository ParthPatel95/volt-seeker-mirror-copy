-- Fix critical security issues before public launch

-- 1. Secure social_profiles table (CRITICAL ERROR)
DROP POLICY IF EXISTS "Public can view social profiles" ON social_profiles;
CREATE POLICY "Authenticated users can view social profiles" 
ON social_profiles FOR SELECT 
TO authenticated
USING (true);

-- 2. Secure social_hashtags table  
DROP POLICY IF EXISTS "Anyone can view hashtags" ON social_hashtags;
CREATE POLICY "Authenticated users can view hashtags" 
ON social_hashtags FOR SELECT 
TO authenticated
USING (true);

-- 3. Update voltmarket_listing_images to require authentication for private images
-- Keep public access for public listings but add option for private
ALTER TABLE voltmarket_listing_images ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update existing policy to be more restrictive
DROP POLICY IF EXISTS "Anyone can view listing images" ON voltmarket_listing_images;
CREATE POLICY "Users can view public listing images" 
ON voltmarket_listing_images FOR SELECT 
USING (is_public = true OR auth.uid() IN (
  SELECT voltmarket_listings.seller_id
  FROM voltmarket_listings
  WHERE voltmarket_listings.id = voltmarket_listing_images.listing_id
));

-- 4. Enable leaked password protection via auth config
-- This needs to be done in the Supabase dashboard under Authentication > Settings

-- 5. Set more secure OTP expiry (3600 seconds = 1 hour instead of default)
-- This also needs to be configured in the dashboard under Authentication > Settings