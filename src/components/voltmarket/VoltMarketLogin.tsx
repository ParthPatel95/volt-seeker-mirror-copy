import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Zap, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export const VoltMarketLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { signIn } = useVoltMarketAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user came from successful signup
    const urlParams = new URLSearchParams(location.search);
    const fromSignup = urlParams.get('from') === 'signup';
    const email = urlParams.get('email');
    
    if (fromSignup && email) {
      setUserEmail(email);
      setFormData(prev => ({ ...prev, email }));
      setShowEmailConfirmation(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check if user arrived after email verification
    if (urlParams.get('verified') === 'true') {
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully! You can now sign in.",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 md:space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">GridBazaar</h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Don't have an account? Sign up
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Confirmation Dialog */}
      <Dialog open={showEmailConfirmation} onOpenChange={setShowEmailConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <DialogTitle className="text-center">Check Your Email</DialogTitle>
            <DialogDescription className="text-center">
              We've sent a confirmation email to:
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{userEmail}</p>
            </div>
            
            <Alert className="text-left">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Important:</strong> You must verify your email before you can sign in. 
                Check your inbox (and spam folder) for the verification link.
              </AlertDescription>
            </Alert>

            <div className="text-sm text-gray-600 space-y-2">
              <p>After clicking the verification link in your email, return here to sign in.</p>
            </div>

            <Button 
              onClick={() => setShowEmailConfirmation(false)}
              className="w-full"
            >
              Got it, I'll check my email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};