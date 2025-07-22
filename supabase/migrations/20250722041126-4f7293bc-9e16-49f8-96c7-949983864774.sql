-- Fix the sync_email_verification function to have proper search_path
CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile when user email verification changes
  UPDATE gridbazaar_profiles 
  SET is_email_verified = (NEW.email_confirmed_at IS NOT NULL)
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';