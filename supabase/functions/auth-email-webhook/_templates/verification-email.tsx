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
  Img,
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
    <Preview>Welcome to GridBazaar - Confirm your email to get started</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with gradient */}
        <Section style={header}>
          <div style={logoContainer}>
            <div style={logoIcon}>⚡</div>
            <Text style={logoText}>GridBazaar</Text>
          </div>
          <Text style={tagline}>Energy Infrastructure Marketplace</Text>
        </Section>
        
        {/* Main content */}
        <Section style={content}>
          <div style={welcomeContainer}>
            <Heading style={h1}>Welcome to the Future of Energy Trading</Heading>
            
            <Text style={paragraph}>
              You're now part of an exclusive network of energy professionals, investors, and innovators reshaping how we trade power infrastructure.
            </Text>
          </div>
          
          <Section style={ctaSection}>
            <Text style={ctaTitle}>Verify your email to get started</Text>
            <Text style={ctaSubtitle}>
              Click the button below to confirm your email address and unlock your GridBazaar account.
            </Text>
            
            <div style={buttonContainer}>
              <Button
                href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
                style={primaryButton}
              >
                Confirm Email Address
              </Button>
            </div>
          </Section>
          
          {/* Features section */}
          <Section style={featuresSection}>
            <Text style={featuresTitle}>What awaits you:</Text>
            
            <div style={featureGrid}>
              <div style={featureItem}>
                <div style={featureIcon}>🏢</div>
                <Text style={featureText}>Browse premium power capacity listings</Text>
              </div>
              <div style={featureItem}>
                <div style={featureIcon}>📊</div>
                <Text style={featureText}>Access real-time market intelligence</Text>
              </div>
              <div style={featureItem}>
                <div style={featureIcon}>🤝</div>
                <Text style={featureText}>Connect with verified buyers & sellers</Text>
              </div>
              <div style={featureItem}>
                <div style={featureIcon}>💼</div>
                <Text style={featureText}>Manage your energy portfolio</Text>
              </div>
            </div>
          </Section>
          
          <Hr style={hr} />
          
          {/* Alternative link */}
          <Section style={linkSection}>
            <Text style={linkTitle}>Trouble with the button?</Text>
            <Text style={linkSubtitle}>Copy and paste this link into your browser:</Text>
            <Text style={linkText}>
              {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            </Text>
          </Section>
          
          {/* Security note */}
          <Section style={securitySection}>
            <Text style={securityText}>
              🔒 This verification link is secure and will expire in 24 hours for your protection.
            </Text>
            <Text style={securityText}>
              If you didn't create this account, please ignore this email or contact our support team.
            </Text>
          </Section>
        </Section>
        
        {/* Footer */}
        <Section style={footer}>
          <div style={footerContent}>
            <Text style={footerBrand}>GridBazaar</Text>
            <Text style={footerTagline}>Powering the Future of Energy Trading</Text>
            
            <div style={footerLinks}>
              <Link href="https://gridbazaar.com/support" style={footerLink}>Support Center</Link>
              <Text style={footerSeparator}>•</Text>
              <Link href="https://gridbazaar.com/privacy" style={footerLink}>Privacy Policy</Link>
              <Text style={footerSeparator}>•</Text>
              <Link href="https://gridbazaar.com/terms" style={footerLink}>Terms of Service</Link>
            </div>
            
            <Text style={footerEmail}>
              This email was sent to {user_email}
            </Text>
          </div>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}

const header = {
  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
  padding: '40px 40px 30px',
  textAlign: 'center' as const,
}

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
}

const logoIcon = {
  fontSize: '32px',
  marginRight: '12px',
}

const logoText = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
}

const tagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  fontWeight: '400',
  margin: '0',
  letterSpacing: '0.5px',
}

const content = {
  padding: '0 40px',
}

const welcomeContainer = {
  textAlign: 'center' as const,
  padding: '40px 0 20px',
}

const h1 = {
  color: '#1e293b',
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 20px',
  letterSpacing: '-0.5px',
}

const paragraph = {
  color: '#64748b',
  fontSize: '18px',
  lineHeight: '1.6',
  margin: '0',
  textAlign: 'center' as const,
}

const ctaSection = {
  textAlign: 'center' as const,
  padding: '30px 20px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  margin: '30px 0',
}

const ctaTitle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 8px',
}

const ctaSubtitle = {
  color: '#64748b',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 24px',
}

const buttonContainer = {
  margin: '24px 0 0',
}

const primaryButton = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
  transition: 'all 0.2s ease',
}

const featuresSection = {
  padding: '30px 0',
}

const featuresTitle = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const featureGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '20px',
}

const featureItem = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
}

const featureIcon = {
  fontSize: '20px',
  marginRight: '12px',
  marginTop: '2px',
}

const featureText = {
  color: '#475569',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '1.4',
  margin: '0',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
}

const linkSection = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const linkTitle = {
  color: '#64748b',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 8px',
}

const linkSubtitle = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '0 0 12px',
}

const linkText = {
  color: '#3b82f6',
  fontSize: '13px',
  lineHeight: '1.4',
  wordBreak: 'break-all' as const,
  padding: '12px 16px',
  backgroundColor: '#f1f5f9',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  margin: '0',
}

const securitySection = {
  textAlign: 'center' as const,
  padding: '20px 0 30px',
}

const securityText = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
}

const footer = {
  backgroundColor: '#1e293b',
  padding: '30px 40px',
}

const footerContent = {
  textAlign: 'center' as const,
}

const footerBrand = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const footerTagline = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '0 0 20px',
}

const footerLinks = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
}

const footerLink = {
  color: '#94a3b8',
  fontSize: '13px',
  textDecoration: 'none',
  margin: '0 8px',
}

const footerSeparator = {
  color: '#64748b',
  fontSize: '13px',
  margin: '0 4px',
}

const footerEmail = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0',
}