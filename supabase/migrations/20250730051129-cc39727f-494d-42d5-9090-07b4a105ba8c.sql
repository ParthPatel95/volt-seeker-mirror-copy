-- Update authentication configuration
-- Reduce OTP expiry time
UPDATE auth.config 
SET 
  otp_exp = 600, -- 10 minutes instead of default longer period
  password_leak_detection = true
WHERE 
  setting IN ('otp_exp', 'password_leak_detection');