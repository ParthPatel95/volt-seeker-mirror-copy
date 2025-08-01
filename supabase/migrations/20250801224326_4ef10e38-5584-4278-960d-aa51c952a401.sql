-- Create a proper social_profiles table that maps to auth.users
CREATE TABLE IF NOT EXISTS public.social_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on social_profiles
ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for social_profiles
CREATE POLICY "Anyone can view social profiles" ON public.social_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own social profile" ON public.social_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social profile" ON public.social_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create profiles for existing users who have posts
INSERT INTO public.social_profiles (user_id, display_name)
SELECT DISTINCT sp.user_id, COALESCE(gp.company_name, au.email)
FROM public.social_posts sp
JOIN auth.users au ON sp.user_id = au.id
LEFT JOIN public.gridbazaar_profiles gp ON sp.user_id = gp.user_id
WHERE sp.user_id NOT IN (SELECT user_id FROM public.social_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- Now add the foreign key constraint
ALTER TABLE public.social_posts 
ADD CONSTRAINT social_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.social_profiles(user_id) ON DELETE CASCADE;

-- Create trigger to update updated_at
CREATE TRIGGER social_profiles_updated_at
  BEFORE UPDATE ON public.social_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create social profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_social_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.social_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create social profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created_social_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_social_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_social_profile();