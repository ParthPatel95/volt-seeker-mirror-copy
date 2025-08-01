-- Update email verification templates to use GridBazaar branding
UPDATE voltmarket_email_templates 
SET 
  subject = 'Verify your GridBazaar account',
  html_content = '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">GridBazaar</h1>
        <p style="color: #93c5fd; margin: 10px 0 0 0; font-size: 16px;">Energy Infrastructure Marketplace</p>
    </div>
    
    <div style="background: white; padding: 40px 20px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>
        
        <p>Hi {{recipient_name}},</p>
        
        <p>Thanks for signing up for GridBazaar! To complete your registration and access all features, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{verification_url}}" 
               style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);">
                Verify Email Address
            </a>
        </div>
        
        <p>If the button above doesn''t work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px; font-family: monospace;">{{verification_url}}</p>
        
        <p>This verification link will expire in 24 hours.</p>
        
        <p>If you didn''t create an account with GridBazaar, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Best regards,<br>
            The GridBazaar Team
        </p>
    </div>
</body>
</html>'
WHERE template_type = 'email_verification';

-- Update email verification reminder template
UPDATE voltmarket_email_templates 
SET 
  subject = 'Complete your GridBazaar registration',
  html_content = '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">GridBazaar</h1>
        <p style="color: #93c5fd; margin: 10px 0 0 0; font-size: 16px;">Energy Infrastructure Marketplace</p>
    </div>
    
    <div style="background: white; padding: 40px 20px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1f2937; margin-top: 0;">Don''t forget to verify your email!</h2>
        
        <p>Hi {{recipient_name}},</p>
        
        <p>We noticed you haven''t verified your email address yet. To unlock full access to GridBazaar and start exploring energy infrastructure opportunities, please verify your email address:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{verification_url}}" 
               style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);">
                Verify Email Address
            </a>
        </div>
        
        <p>If the button above doesn''t work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px; font-family: monospace;">{{verification_url}}</p>
        
        <p>This verification link will expire in 24 hours.</p>
        
        <p>If you didn''t create an account with GridBazaar, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Best regards,<br>
            The GridBazaar Team
        </p>
    </div>
</body>
</html>'
WHERE template_type = 'email_verification_reminder';