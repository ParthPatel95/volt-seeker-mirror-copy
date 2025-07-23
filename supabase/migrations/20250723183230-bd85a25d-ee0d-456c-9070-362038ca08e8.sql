-- Create voltmarket_nda_requests table for access requests
CREATE TABLE IF NOT EXISTS public.voltmarket_nda_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.voltmarket_listings(id),
  requester_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID NOT NULL REFERENCES public.gridbazaar_profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on voltmarket_nda_requests
ALTER TABLE public.voltmarket_nda_requests ENABLE ROW LEVEL SECURITY;

-- Create simple policies for voltmarket_nda_requests
CREATE POLICY "Users can submit NDA requests" ON public.voltmarket_nda_requests 
FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can view their own NDA requests" ON public.voltmarket_nda_requests 
FOR SELECT USING (auth.uid() = requester_id);

CREATE POLICY "Users can update their own NDA requests" ON public.voltmarket_nda_requests 
FOR UPDATE USING (auth.uid() = requester_id);