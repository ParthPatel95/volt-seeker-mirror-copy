import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerificationCodeEmailProps {
  verification_code: string
  user_email: string
}

export const VerificationCodeEmail = ({
  verification_code,
  user_email,
}: VerificationCodeEmailProps) => (
  <Html>
    <Head />
    <Preview>Your GridBazaar verification code: {verification_code}</Preview>
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
            <Heading style={h1}>Verify Your Email Address</Heading>
            
            <Text style={paragraph}>
              Welcome to GridBazaar! To complete your registration, please enter the verification code below in your browser.
            </Text>
          </div>
          
          <Section style={codeSection}>
            <Text style={codeTitle}>Your verification code:</Text>
            <div style={codeContainer}>
              <Text style={codeText}>{verification_code}</Text>
            </div>
            <Text style={codeSubtitle}>
              Enter this code in the verification screen to activate your account.
            </Text>
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
          
          {/* Security note */}
          <Section style={securitySection}>
            <Text style={securityText}>
              🔒 This verification code expires in 15 minutes for your security.
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
            
            <Text style={footerEmail}>
              This email was sent to {user_email}
            </Text>
          </div>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationCodeEmail

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

const codeSection = {
  textAlign: 'center' as const,
  padding: '30px 20px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  margin: '30px 0',
}

const codeTitle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 20px',
}

const codeContainer = {
  backgroundColor: '#ffffff',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}

const codeText = {
  color: '#1e293b',
  fontSize: '36px',
  fontWeight: '700',
  fontFamily: 'monospace',
  letterSpacing: '8px',
  margin: '0',
}

const codeSubtitle = {
  color: '#64748b',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0',
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

const footerEmail = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0',
}