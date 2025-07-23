-- Fix the column name mismatch in voltmarket_nda_requests table
ALTER TABLE public.voltmarket_nda_requests 
RENAME COLUMN requested_at TO created_at_temp;

ALTER TABLE public.voltmarket_nda_requests 
ADD COLUMN requested_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;

-- Copy data from created_at to requested_at
UPDATE public.voltmarket_nda_requests 
SET requested_at = created_at_temp;

-- Drop the temporary column
ALTER TABLE public.voltmarket_nda_requests 
DROP COLUMN created_at_temp;

-- Also ensure we have the right foreign key relationship structure
-- Drop and recreate the foreign key to make sure the relationship is properly recognized
ALTER TABLE public.voltmarket_nda_requests 
DROP CONSTRAINT IF EXISTS fk_voltmarket_nda_requests_listing;

ALTER TABLE public.voltmarket_nda_requests 
ADD CONSTRAINT fk_voltmarket_nda_requests_listing 
FOREIGN KEY (listing_id) REFERENCES public.voltmarket_listings(id) ON DELETE CASCADE;