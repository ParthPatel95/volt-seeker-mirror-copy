import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Verification Link</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; }
            .error { color: #dc2626; }
            .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">
              <h1>❌ Invalid Verification Link</h1>
              <p>The verification link is invalid or missing required information.</p>
              <p>Please request a new verification email from your account.</p>
              <a href="https://gridbazaar.com" class="btn">Go to GridBazaar</a>
            </div>
          </div>
        </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
          status: 400,
        }
      );
    }

    // Find the verification token
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('voltmarket_email_verification_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Invalid or Expired Link</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; }
            .error { color: #dc2626; }
            .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">
              <h1>🔗 Link Expired or Invalid</h1>
              <p>This verification link has either expired or has already been used.</p>
              <p>Please request a new verification email from your account settings.</p>
              <a href="https://gridbazaar.com" class="btn">Go to GridBazaar</a>
            </div>
          </div>
        </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
          status: 400,
        }
      );
    }

    // Check if token has expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Verification Link Expired</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; }
            .error { color: #dc2626; }
            .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">
              <h1>⏰ Link Expired</h1>
              <p>This verification link has expired. Verification links are valid for 24 hours.</p>
              <p>Please request a new verification email from your account.</p>
              <a href="https://gridbazaar.com" class="btn">Go to GridBazaar</a>
            </div>
          </div>
        </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
          status: 400,
        }
      );
    }

    // Mark token as used
    const { error: markUsedError } = await supabaseClient
      .from('voltmarket_email_verification_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    if (markUsedError) {
      console.error('Error marking token as used:', markUsedError);
    }

    // First check if profile exists, if not create it
    const { data: existingProfile } = await supabaseClient
      .from('gridbazaar_profiles')
      .select('id')
      .eq('user_id', tokenData.user_id)
      .single();

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error: createError } = await supabaseClient
        .from('gridbazaar_profiles')
        .insert({
          user_id: tokenData.user_id,
          company_name: 'GridBazaar User', // Default company name
          role: 'buyer', // Default role
          is_email_verified: true
        });

      if (createError) {
        console.error('Error creating profile:', createError);
        // Continue anyway, we'll try to update existing profile
      }
    } else {
      // Update existing profile to mark email as verified
      const { error: profileError } = await supabaseClient
        .from('gridbazaar_profiles')
        .update({ 
          is_email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', tokenData.user_id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Continue anyway, the email verification was successful
      }
    }

    // SUCCESS - Show GridBazaar branded success page with auto-redirect
    console.log('Email verification successful for user:', tokenData.user_id);
    
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified Successfully!</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="refresh" content="3;url=https://gridbazaar.com/?verified=true">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container { 
            max-width: 600px; 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
            text-align: center;
            border-top: 4px solid #3b82f6;
          }
          .success { color: #16a34a; }
          .brand { 
            color: #3b82f6; 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .tagline {
            color: #64748b;
            margin-bottom: 30px;
            font-size: 14px;
          }
          .btn { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            display: inline-block; 
            margin-top: 20px;
            font-weight: bold;
            transition: transform 0.2s;
          }
          .btn:hover {
            transform: translateY(-2px);
          }
          .loading { 
            display: inline-block; 
            width: 20px; 
            height: 20px; 
            border: 3px solid #f3f3f3; 
            border-top: 3px solid #3b82f6; 
            border-radius: 50%; 
            animation: spin 1s linear infinite;
            margin-right: 10px;
          }
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
          .redirect-info {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">GridBazaar</div>
          <div class="tagline">Energy Infrastructure Marketplace</div>
          
          <div class="success">
            <h1>✅ Email Verified Successfully!</h1>
            <p>Your email address has been verified. You can now sign in to your account and access all GridBazaar features.</p>
            
            <div class="redirect-info">
              <div class="loading"></div>
              <strong>Redirecting you to GridBazaar...</strong>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #64748b;">
                You will be automatically redirected in 3 seconds
              </p>
            </div>
            
            <a href="https://gridbazaar.com/?verified=true" class="btn">
              Go to GridBazaar Now
            </a>
          </div>
        </div>
      </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...corsHeaders,
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error verifying email:', error);
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Verification Failed</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; }
          .error { color: #dc2626; }
          .btn { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error">
            <h1>❌ Verification Failed</h1>
            <p>An unexpected error occurred during verification. Please try again or contact support.</p>
            <a href="https://gridbazaar.com" class="btn">Go to GridBazaar</a>
          </div>
        </div>
      </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
        status: 500,
      }
    );
  }
});