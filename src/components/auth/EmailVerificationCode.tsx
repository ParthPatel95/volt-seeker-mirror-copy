import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationCodeProps {
  email: string;
  userId: string;
  onVerified: () => void;
  onBack: () => void;
}

export const EmailVerificationCode: React.FC<EmailVerificationCodeProps> = ({
  email,
  userId,
  onVerified,
  onBack,
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  // Format email for display (hide part of it)
  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    const hiddenPart = '*'.repeat(Math.max(0, localPart.length - 3));
    return `${localPart.slice(0, 3)}${hiddenPart}@${domain}`;
  };

  // Start resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-format code input (add spaces every 3 digits)
  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      setCode(numericValue);
      setError('');
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: {
          code: code,
          email: email,
        },
      });

      if (error) {
        console.error('Verification error:', error);
        setError(error.message || 'Failed to verify code. Please try again.');
        return;
      }

      if (data.success) {
        toast({
          title: "Email Verified!",
          description: "Your email has been successfully verified.",
        });
        onVerified();
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError('');

    try {
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: {
          email: email,
          user_id: userId,
          is_resend: true,
        },
      });

      if (error) {
        console.error('Resend error:', error);
        setError('Failed to resend code. Please try again.');
        return;
      }

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
      setResendCooldown(60); // 60 second cooldown
      setCode(''); // Clear the current code
    } catch (err: any) {
      console.error('Resend error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !isVerifying) {
      handleVerifyCode();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-foreground">
            {formatEmail(email)}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="verification-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg tracking-widest font-mono"
              maxLength={6}
              disabled={isVerifying}
            />
            <p className="text-xs text-muted-foreground text-center">
              Enter the code exactly as shown in your email
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleVerifyCode}
              disabled={code.length !== 6 || isVerifying}
              className="w-full"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={isResending || resendCooldown > 0}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              🔒 Your verification code expires in 15 minutes for security. 
              If you're having trouble, please check your spam folder.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};