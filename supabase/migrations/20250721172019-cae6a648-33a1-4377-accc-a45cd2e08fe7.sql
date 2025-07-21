-- Create voltmarket listing images table
CREATE TABLE public.voltmarket_listing_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.voltmarket_listing_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view listing images" 
ON public.voltmarket_listing_images 
FOR SELECT 
USING (true);

CREATE POLICY "Listing owners can manage their images" 
ON public.voltmarket_listing_images 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.voltmarket_listings 
    WHERE voltmarket_listings.id = voltmarket_listing_images.listing_id 
    AND voltmarket_listings.seller_id = auth.uid()
  )
);

-- Add foreign key constraint
ALTER TABLE public.voltmarket_listing_images 
ADD CONSTRAINT fk_voltmarket_listing_images_listing_id 
FOREIGN KEY (listing_id) REFERENCES public.voltmarket_listings(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_voltmarket_listing_images_listing_id ON public.voltmarket_listing_images(listing_id);
CREATE INDEX idx_voltmarket_listing_images_sort_order ON public.voltmarket_listing_images(listing_id, sort_order);