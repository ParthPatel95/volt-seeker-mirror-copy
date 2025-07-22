import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerificationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const VerificationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to GridBazaar - Confirm your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logo}>
            <Text style={logoText}>⚡ GridBazaar</Text>
          </div>
        </Section>
        
        <Section style={content}>
          <Heading style={h1}>Welcome to GridBazaar!</Heading>
          
          <Text style={paragraph}>
            Thank you for signing up with GridBazaar, the premier marketplace for energy infrastructure and power capacity trading.
          </Text>
          
          <Text style={paragraph}>
            To get started and access your account, please confirm your email address by clicking the button below:
          </Text>
          
          <Section style={buttonContainer}>
            <Button
              href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              style={button}
            >
              Confirm Email Address
            </Button>
          </Section>
          
          <Text style={paragraph}>
            If the button doesn't work, you can also copy and paste this link into your browser:
          </Text>
          
          <Text style={linkText}>
            {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          </Text>
          
          <Hr style={hr} />
          
          <Text style={paragraph}>
            Once confirmed, you'll be able to:
          </Text>
          
          <ul style={list}>
            <li style={listItem}>Browse available power capacity listings</li>
            <li style={listItem}>Connect with buyers and sellers</li>
            <li style={listItem}>Access market intelligence and analytics</li>
            <li style={listItem}>Manage your energy infrastructure portfolio</li>
          </ul>
          
          <Text style={paragraph}>
            If you didn't create an account with GridBazaar, you can safely ignore this email.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>
            This email was sent to {user_email}. 
          </Text>
          <Text style={footerText}>
            GridBazaar - Powering the Future of Energy Trading
          </Text>
          <Text style={footerText}>
            Need help? Contact us at support@gridbazaar.com
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '20px 40px',
  backgroundColor: '#1a365d',
}

const logo = {
  textAlign: 'center' as const,
}

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const content = {
  padding: '20px 40px',
}

const h1 = {
  color: '#1a365d',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '40px 0',
}

const paragraph = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3182ce',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
}

const linkText = {
  color: '#3182ce',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  margin: '16px 0',
}

const list = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  paddingLeft: '20px',
  margin: '16px 0',
}

const listItem = {
  margin: '8px 0',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '32px 0',
}

const footer = {
  padding: '20px 40px',
  backgroundColor: '#f8f9fa',
}

const footerText = {
  color: '#8a8a8a',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '4px 0',
}