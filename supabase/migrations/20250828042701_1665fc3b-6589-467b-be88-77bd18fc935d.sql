-- Fix RLS policies for voltmarket_listings to allow authenticated users to create listings
DROP POLICY IF EXISTS "Users can create listings" ON public.voltmarket_listings;

-- Create new policy for authenticated users to create listings
CREATE POLICY "Authenticated users can create listings" 
ON public.voltmarket_listings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = seller_id);