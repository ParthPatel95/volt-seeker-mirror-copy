-- Fix email verification sync issue
UPDATE gridbazaar_profiles 
SET is_email_verified = true 
WHERE user_id = 'e185222c-4975-40a7-a746-b8ef28058354' AND is_email_verified = false;

-- Create a function to automatically sync email verification status
CREATE OR REPLACE FUNCTION sync_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile when user email verification changes
  UPDATE gridbazaar_profiles 
  SET is_email_verified = (NEW.email_confirmed_at IS NOT NULL)
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically sync email verification
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
  EXECUTE FUNCTION sync_email_verification();