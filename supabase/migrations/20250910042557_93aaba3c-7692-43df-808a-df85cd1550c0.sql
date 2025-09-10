-- Create DELETE policy for voltmarket_listings to allow sellers to delete their own listings
CREATE POLICY "Sellers can delete own listings"
ON public.voltmarket_listings
FOR DELETE
TO public
USING (auth.uid() = seller_id);