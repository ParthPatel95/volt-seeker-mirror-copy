-- Update the current user's profile to have a display name for testing
UPDATE profiles 
SET full_name = 'Baps Patel', 
    company = 'BFarms365',
    bio = 'Energy market professional',
    updated_at = NOW()
WHERE user_id = '84253d17-ec00-4e5a-94ff-d841e1c9ccd7';