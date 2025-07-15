-- Create gridbazaar_profiles table
CREATE TABLE public.gridbazaar_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
  seller_type TEXT CHECK (seller_type IN ('site_owner', 'broker', 'realtor', 'equipment_vendor')),
  company_name TEXT,
  phone_number TEXT,
  is_id_verified BOOLEAN NOT NULL DEFAULT false,
  is_email_verified BOOLEAN NOT NULL DEFAULT false,
  profile_image_url TEXT,
  bio TEXT,
  website TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.gridbazaar_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for gridbazaar_profiles
CREATE POLICY "Users can view their own profile" 
ON public.gridbazaar_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.gridbazaar_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.gridbazaar_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.gridbazaar_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_gridbazaar_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gridbazaar_profiles_updated_at
BEFORE UPDATE ON public.gridbazaar_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_gridbazaar_profiles_updated_at();