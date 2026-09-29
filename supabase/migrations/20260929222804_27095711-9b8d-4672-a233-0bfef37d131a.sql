CREATE OR REPLACE FUNCTION public.get_public_voltmarket_sellers()
RETURNS TABLE (
  user_id uuid,
  company_name text,
  bio text,
  seller_type text,
  website text,
  profile_image_url text,
  is_id_verified boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    p.company_name,
    p.bio,
    p.seller_type,
    p.website,
    p.profile_image_url,
    p.is_id_verified,
    p.created_at
  FROM public.gridbazaar_profiles AS p
  WHERE p.role = 'seller';
$$;

REVOKE ALL ON FUNCTION public.get_public_voltmarket_sellers() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_voltmarket_sellers() TO anon, authenticated, service_role;