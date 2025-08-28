-- Fix RLS policies for storage buckets to allow authenticated users to upload files

-- Allow users to upload to listing-images bucket
CREATE POLICY "Allow authenticated users to upload listing images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND bucket_id = 'listing-images'
);

CREATE POLICY "Allow users to view listing images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'listing-images');

CREATE POLICY "Allow users to delete their own listing images" 
ON storage.objects 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND bucket_id = 'listing-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to upload to profile-images bucket
CREATE POLICY "Allow authenticated users to upload profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND bucket_id = 'profile-images'
);

CREATE POLICY "Allow users to view profile images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

CREATE POLICY "Allow users to delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to upload to documents bucket
CREATE POLICY "Allow authenticated users to upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND bucket_id = 'documents'
);

CREATE POLICY "Allow users to view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);