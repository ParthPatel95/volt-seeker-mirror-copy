-- Add foreign key relationship between voltmarket_nda_requests and voltmarket_listings
ALTER TABLE public.voltmarket_nda_requests 
ADD CONSTRAINT fk_voltmarket_nda_requests_listing 
FOREIGN KEY (listing_id) REFERENCES public.voltmarket_listings(id) ON DELETE CASCADE;