-- Remove recent database changes that may be causing restoration issues

-- Drop the voltmarket_nda_requests table if it exists
DROP TABLE IF EXISTS public.voltmarket_nda_requests CASCADE;

-- Drop any foreign key constraints that might be causing issues
ALTER TABLE IF EXISTS public.voltmarket_nda_requests DROP CONSTRAINT IF EXISTS fk_voltmarket_nda_requests_listing;
ALTER TABLE IF EXISTS public.voltmarket_nda_requests DROP CONSTRAINT IF EXISTS voltmarket_nda_requests_listing_id_fkey;
ALTER TABLE IF EXISTS public.voltmarket_nda_requests DROP CONSTRAINT IF EXISTS voltmarket_nda_requests_seller_id_fkey;
ALTER TABLE IF EXISTS public.voltmarket_nda_requests DROP CONSTRAINT IF EXISTS voltmarket_nda_requests_requester_id_fkey;