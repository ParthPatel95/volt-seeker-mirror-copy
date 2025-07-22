-- Create the missing email verification tokens table
CREATE TABLE IF NOT EXISTS public.voltmarket_email_verification_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.voltmarket_email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for verification tokens
CREATE POLICY "Users can view their own verification tokens" 
ON public.voltmarket_email_verification_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage verification tokens" 
ON public.voltmarket_email_verification_tokens 
FOR ALL 
USING (true);

-- Add index for performance
CREATE INDEX idx_voltmarket_email_verification_tokens_user_id 
ON public.voltmarket_email_verification_tokens(user_id);

CREATE INDEX idx_voltmarket_email_verification_tokens_token 
ON public.voltmarket_email_verification_tokens(token);

CREATE INDEX idx_voltmarket_email_verification_tokens_expires_at 
ON public.voltmarket_email_verification_tokens(expires_at);