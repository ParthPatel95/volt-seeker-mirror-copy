import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyCodeRequest {
  code: string
  email: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    console.log('Starting email code verification...')
    
    // Initialize Supabase client with service role for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { code, email }: VerifyCodeRequest = await req.json()
    console.log('Verifying code for email:', email)

    if (!code || !email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Code and email are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    // Find the verification code in database
    const { data: codeData, error: codeError } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('code', code.trim())
      .eq('email', email.toLowerCase())
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (codeError) {
      console.error('Database error:', codeError)
      return new Response(
        JSON.stringify({ success: false, error: 'Database error occurred' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    if (!codeData) {
      console.log('Invalid or expired code')
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired verification code' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    console.log('Valid code found, marking as used...')

    // Mark the code as used
    const { error: updateError } = await supabase
      .from('email_verification_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', codeData.id)

    if (updateError) {
      console.error('Error marking code as used:', updateError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to process verification' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    // If user_id is null (webhook-generated code), find the user by email
    let userId = codeData.user_id
    if (!userId) {
      console.log('Finding user by email for webhook-generated code...')
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
      
      if (!userError && userData.users) {
        const user = userData.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
        if (user) {
          userId = user.id
          // Update the code record with the user_id
          await supabase
            .from('email_verification_codes')
            .update({ user_id: userId })
            .eq('id', codeData.id)
        }
      }
    }

    // Update the user's email verification status in their profile AND Supabase auth
    if (userId) {
      console.log('Updating user profile email verification status...')
      const { error: profileError } = await supabase
        .from('gridbazaar_profiles')
        .update({ is_email_verified: true })
        .eq('user_id', userId)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        // Don't fail the request if profile update fails, as the main verification succeeded
        console.log('Profile update failed but verification succeeded')
      }

      // CRITICAL: Also update Supabase Auth email_confirmed_at to sync with native auth system
      console.log('Updating Supabase auth email confirmation...')
      const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
        userId,
        { 
          email_confirm: true,
          user_metadata: { email_verified: true }
        }
      )

      if (authUpdateError) {
        console.error('Error updating Supabase auth email confirmation:', authUpdateError)
        // Don't fail the verification even if this fails
      } else {
        console.log('Successfully updated Supabase auth email confirmation')
      }
    }

    console.log('Email verification completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email verified successfully',
        user_id: userId 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )

  } catch (error: any) {
    console.error('Error in verify-email-code function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    )
  }
})