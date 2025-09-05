-- Update email verification codes table to allow null user_id temporarily
-- This is needed because the webhook doesn't have user context, only email
ALTER TABLE public.email_verification_codes ALTER COLUMN user_id DROP NOT NULL;

-- Update the foreign key constraint to handle null user_id
ALTER TABLE public.email_verification_codes DROP CONSTRAINT IF EXISTS email_verification_codes_user_id_fkey;
ALTER TABLE public.email_verification_codes ADD CONSTRAINT email_verification_codes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;