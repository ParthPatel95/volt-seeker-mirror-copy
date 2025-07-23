-- First drop all policies that depend on seller_id
DROP POLICY IF EXISTS "Users can view NDA requests they're involved in" ON public.voltmarket_nda_requests;
DROP POLICY IF EXISTS "Sellers can update NDA request status" ON public.voltmarket_nda_requests;

-- Now we can drop and recreate the seller_id column
ALTER TABLE public.voltmarket_nda_requests 
DROP COLUMN seller_id CASCADE;

ALTER TABLE public.voltmarket_nda_requests 
ADD COLUMN seller_id UUID NOT NULL REFERENCES public.gridbazaar_profiles(id) ON DELETE CASCADE;

-- Recreate the policies with the corrected structure
CREATE POLICY "Users can view NDA requests they're involved in" 
ON public.voltmarket_nda_requests 
FOR SELECT 
USING (
  auth.uid() = requester_id OR 
  seller_id = ANY(SELECT id FROM gridbazaar_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Sellers can update NDA request status" 
ON public.voltmarket_nda_requests 
FOR UPDATE 
USING (
  seller_id = ANY(SELECT id FROM gridbazaar_profiles WHERE user_id = auth.uid())
);