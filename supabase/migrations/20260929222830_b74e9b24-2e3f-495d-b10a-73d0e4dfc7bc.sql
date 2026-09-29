DROP FUNCTION IF EXISTS public.get_public_voltmarket_sellers();

CREATE TABLE public.voltmarket_seller_directory (
  user_id uuid PRIMARY KEY,
  company_name text NOT NULL,
  bio text,
  seller_type text,
  website text,
  profile_image_url text,
  is_id_verified boolean NOT NULL DEFAULT false,
  member_since timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.voltmarket_seller_directory TO anon, authenticated;
GRANT ALL ON public.voltmarket_seller_directory TO service_role;

ALTER TABLE public.voltmarket_seller_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view marketplace sellers"
ON public.voltmarket_seller_directory
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.sync_voltmarket_seller_directory()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.voltmarket_seller_directory WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;

  IF NEW.role = 'seller' THEN
    INSERT INTO public.voltmarket_seller_directory (
      user_id, company_name, bio, seller_type, website,
      profile_image_url, is_id_verified, member_since
    ) VALUES (
      NEW.user_id,
      COALESCE(NULLIF(BTRIM(NEW.company_name), ''), 'Marketplace Seller'),
      NEW.bio,
      NEW.seller_type,
      NEW.website,
      NEW.profile_image_url,
      COALESCE(NEW.is_id_verified, false),
      NEW.created_at
    )
    ON CONFLICT (user_id) DO UPDATE SET
      company_name = EXCLUDED.company_name,
      bio = EXCLUDED.bio,
      seller_type = EXCLUDED.seller_type,
      website = EXCLUDED.website,
      profile_image_url = EXCLUDED.profile_image_url,
      is_id_verified = EXCLUDED.is_id_verified,
      member_since = EXCLUDED.member_since;
  ELSE
    DELETE FROM public.voltmarket_seller_directory WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_voltmarket_seller_directory() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_voltmarket_seller_directory() TO service_role;

CREATE TRIGGER sync_voltmarket_seller_directory_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.gridbazaar_profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_voltmarket_seller_directory();

INSERT INTO public.voltmarket_seller_directory (
  user_id, company_name, bio, seller_type, website,
  profile_image_url, is_id_verified, member_since
)
SELECT
  user_id,
  COALESCE(NULLIF(BTRIM(company_name), ''), 'Marketplace Seller'),
  bio,
  seller_type,
  website,
  profile_image_url,
  COALESCE(is_id_verified, false),
  created_at
FROM public.gridbazaar_profiles
WHERE role = 'seller'
ON CONFLICT (user_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  bio = EXCLUDED.bio,
  seller_type = EXCLUDED.seller_type,
  website = EXCLUDED.website,
  profile_image_url = EXCLUDED.profile_image_url,
  is_id_verified = EXCLUDED.is_id_verified,
  member_since = EXCLUDED.member_since;