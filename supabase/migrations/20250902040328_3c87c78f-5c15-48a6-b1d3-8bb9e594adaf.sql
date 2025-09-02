-- Add foreign key constraint between voltmarket_watchlist and voltmarket_listings
ALTER TABLE public.voltmarket_watchlist 
ADD CONSTRAINT fk_voltmarket_watchlist_listing_id 
FOREIGN KEY (listing_id) REFERENCES public.voltmarket_listings(id) 
ON DELETE CASCADE;