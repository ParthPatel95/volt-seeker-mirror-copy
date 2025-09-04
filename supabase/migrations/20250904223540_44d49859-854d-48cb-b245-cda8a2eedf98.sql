-- Create email verification codes table
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '15 minutes'),
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for the verification codes
CREATE POLICY "Users can view their own verification codes" 
ON public.email_verification_codes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all verification codes" 
ON public.email_verification_codes 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add indexes for performance
CREATE INDEX idx_email_verification_codes_user_id ON public.email_verification_codes(user_id);
CREATE INDEX idx_email_verification_codes_code ON public.email_verification_codes(code);
CREATE INDEX idx_email_verification_codes_expires_at ON public.email_verification_codes(expires_at);

-- Add trigger for updated_at
CREATE TRIGGER update_email_verification_codes_updated_at
BEFORE UPDATE ON public.email_verification_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate 6-digit verification code
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;