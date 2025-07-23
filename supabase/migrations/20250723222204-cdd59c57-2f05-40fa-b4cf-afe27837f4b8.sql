-- Fix the voltmarket_nda_requests table structure
-- The seller_id should reference gridbazaar_profiles.id, not be a separate UUID
ALTER TABLE public.voltmarket_nda_requests 
DROP COLUMN seller_id;

ALTER TABLE public.voltmarket_nda_requests 
ADD COLUMN seller_id UUID NOT NULL REFERENCES public.gridbazaar_profiles(id) ON DELETE CASCADE;

-- Also update the RLS policies to work correctly with the new structure
DROP POLICY IF EXISTS "Users can view NDA requests they're involved in" ON public.voltmarket_nda_requests;
DROP POLICY IF EXISTS "Sellers can update NDA request status" ON public.voltmarket_nda_requests;

-- Create new policies
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