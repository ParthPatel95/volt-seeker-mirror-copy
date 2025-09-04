import React from 'npm:react@18.3.1'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { VerificationCodeEmail } from './_templates/verification-code-email.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendCodeRequest {
  email: string
  user_id: string
  is_resend?: boolean
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
    console.log('Starting send verification code process...')
    
    // Initialize Supabase client with service role for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize Resend client
    const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

    const { email, user_id, is_resend = false }: SendCodeRequest = await req.json()
    console.log('Sending verification code to:', email, 'for user:', user_id)

    if (!email || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Email and user_id are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    // Generate 6-digit verification code using the database function
    const { data: codeResult, error: codeGenerationError } = await supabase
      .rpc('generate_verification_code')

    if (codeGenerationError || !codeResult) {
      console.error('Error generating code:', codeGenerationError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate verification code' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    const verificationCode = codeResult
    console.log('Generated verification code:', verificationCode)

    // Clean up any existing unused codes for this user
    await supabase
      .from('email_verification_codes')
      .delete()
      .eq('user_id', user_id)
      .eq('email', email.toLowerCase())
      .is('used_at', null)

    // Insert new verification code
    const { error: insertError } = await supabase
      .from('email_verification_codes')
      .insert({
        user_id,
        email: email.toLowerCase(),
        code: verificationCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      })

    if (insertError) {
      console.error('Error saving verification code:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to save verification code' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    console.log('Rendering email template...')
    const html = await renderAsync(
      React.createElement(VerificationCodeEmail, {
        verification_code: verificationCode,
        user_email: email,
      })
    )

    console.log('Sending email via Resend...')
    const { data, error } = await resend.emails.send({
      from: 'GridBazaar <noreply@gridbazaar.com>',
      to: [email],
      subject: `Your GridBazaar verification code: ${verificationCode}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: is_resend ? 'Verification code resent successfully' : 'Verification code sent successfully',
        data 
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
    console.error('Error in send-verification-code function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          details: error.details || 'Unknown error occurred',
        },
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