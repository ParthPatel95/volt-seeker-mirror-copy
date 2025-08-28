import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle, PlayCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HealthCheck {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  message?: string;
  duration?: number;
  category: string;
}

export const SystemHealthCheck: React.FC = () => {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCheck, setCurrentCheck] = useState<string | null>(null);
  const { toast } = useToast();

  const initializeChecks = (): HealthCheck[] => [
    { name: 'Database Connectivity', status: 'pending', category: 'Core' },
    { name: 'Authentication System', status: 'pending', category: 'Core' },
    { name: 'VoltMarket Profiles', status: 'pending', category: 'VoltMarket' },
    { name: 'VoltMarket Listings', status: 'pending', category: 'VoltMarket' },
    { name: 'Social Network Features', status: 'pending', category: 'Social' },
    { name: 'File Storage', status: 'pending', category: 'Storage' },
    { name: 'Google Maps Integration', status: 'pending', category: 'Integration' },
    { name: 'Real-time Features', status: 'pending', category: 'Real-time' },
    { name: 'Analytics System', status: 'pending', category: 'Analytics' },
    { name: 'Security Policies', status: 'pending', category: 'Security' },
  ];

  useEffect(() => {
    setChecks(initializeChecks());
  }, []);

  const updateCheck = (name: string, update: Partial<HealthCheck>) => {
    setChecks(prev => prev.map(check => 
      check.name === name ? { ...check, ...update } : check
    ));
  };

  const runCheck = async (checkName: string, testFunction: () => Promise<void>) => {
    const startTime = Date.now();
    setCurrentCheck(checkName);
    updateCheck(checkName, { status: 'running' });

    try {
      await testFunction();
      const duration = Date.now() - startTime;
      updateCheck(checkName, { 
        status: 'passed', 
        message: `✓ Completed successfully`, 
        duration 
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateCheck(checkName, { 
        status: 'failed', 
        message: `✗ ${error.message}`, 
        duration 
      });
    }
  };

  const testDatabaseConnectivity = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) throw new Error(`Database connection failed: ${error.message}`);
  };

  const testAuthentication = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw new Error(`Auth system error: ${error.message}`);
    
    // Test auth state management
    const { data: { user } } = await supabase.auth.getUser();
    // This should not throw an error even if user is null
  };

  const testVoltMarketProfiles = async () => {
    const { data, error } = await supabase
      .from('voltmarket_profiles')
      .select('id, user_id, created_at')
      .limit(5);
    
    if (error) throw new Error(`VoltMarket profiles error: ${error.message}`);
  };

  const testVoltMarketListings = async () => {
    const { data, error } = await supabase
      .from('voltmarket_listings')
      .select('id, title, status, created_at')
      .limit(5);
    
    if (error) throw new Error(`VoltMarket listings error: ${error.message}`);
  };

  const testSocialNetwork = async () => {
    const { data, error } = await supabase
      .from('social_posts')
      .select('id, content, user_id, created_at')
      .limit(5);
    
    if (error) throw new Error(`Social network error: ${error.message}`);
  };

  const testFileStorage = async () => {
    const { data, error } = await supabase.storage
      .from('listing-images')
      .list('', { limit: 1 });
    
    if (error) throw new Error(`File storage error: ${error.message}`);
  };

  const testGoogleMaps = async (): Promise<void> => {
    // Check if Google Maps API is accessible
    if (typeof window !== 'undefined' && (window as any).google) {
      // Google Maps is loaded
      return;
    }
    
    // Check if API key is configured (basic test)
    const hasApiKey = document.querySelector('script[src*="maps.googleapis.com"]');
    if (!hasApiKey) {
      throw new Error('Google Maps API not loaded');
    }
  };

  const testRealTimeFeatures = async (): Promise<void> => {
    // Test realtime subscription capability
    const channel = supabase.channel('health-check');
    
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        channel.unsubscribe();
        reject(new Error('Real-time connection timeout'));
      }, 5000);

      channel
        .on('presence', { event: 'sync' }, () => {
          clearTimeout(timeout);
          channel.unsubscribe();
          resolve();
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            clearTimeout(timeout);
            channel.unsubscribe();
            resolve();
          }
        });
    });
  };

  const testAnalytics = async () => {
    const { data, error } = await supabase
      .from('voltmarket_analytics')
      .select('id, metric_type, recorded_at')
      .limit(5);
    
    if (error) throw new Error(`Analytics system error: ${error.message}`);
  };

  const testSecurityPolicies = async () => {
    // Test that RLS policies are working
    try {
      // This should work for authenticated users
      const { data, error } = await supabase
        .from('voltmarket_email_verification_tokens')
        .select('count(*)')
        .limit(1);
      
      // If we get data without authentication, that would be a security issue
      // If we get a proper auth error, that's expected and good
      if (error && error.message.includes('RLS')) {
        // This is good - RLS is working
        return;
      } else if (error && error.message.includes('permission')) {
        // This is also good - permissions are working
        return;
      } else if (!error) {
        // If no error and we're not authenticated, this might be a security issue
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Security policies may not be working - unauthenticated access allowed');
        }
      }
    } catch (error: any) {
      if (error.message.includes('permission') || error.message.includes('RLS')) {
        // This is good - security is working
        return;
      }
      throw error;
    }
  };

  const runAllChecks = async () => {
    setIsRunning(true);
    setChecks(initializeChecks());

    const testFunctions = {
      'Database Connectivity': testDatabaseConnectivity,
      'Authentication System': testAuthentication,
      'VoltMarket Profiles': testVoltMarketProfiles,
      'VoltMarket Listings': testVoltMarketListings,
      'Social Network Features': testSocialNetwork,
      'File Storage': testFileStorage,
      'Google Maps Integration': testGoogleMaps,
      'Real-time Features': testRealTimeFeatures,
      'Analytics System': testAnalytics,
      'Security Policies': testSecurityPolicies,
    };

    for (const [checkName, testFunction] of Object.entries(testFunctions)) {
      await runCheck(checkName, testFunction);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setCurrentCheck(null);
    setIsRunning(false);

    const results = checks.filter(c => c.status !== 'pending');
    const passed = results.filter(c => c.status === 'passed').length;
    const failed = results.filter(c => c.status === 'failed').length;
    const warnings = results.filter(c => c.status === 'warning').length;

    toast({
      title: "Health Check Complete",
      description: `${passed} passed, ${failed} failed, ${warnings} warnings`,
      variant: failed > 0 ? "destructive" : "default"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'running': return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      warning: 'outline',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, HealthCheck[]>);

  const overallStats = {
    total: checks.length,
    passed: checks.filter(c => c.status === 'passed').length,
    failed: checks.filter(c => c.status === 'failed').length,
    warnings: checks.filter(c => c.status === 'warning').length,
    pending: checks.filter(c => c.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="w-6 h-6" />
              System Health Check
            </CardTitle>
            <Button 
              onClick={runAllChecks} 
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? 'Running...' : 'Run All Checks'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{overallStats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{overallStats.warnings}</div>
              <div className="text-sm text-gray-500">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{overallStats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>

          {isRunning && currentCheck && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-blue-800 font-medium">Running: {currentCheck}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                <div className="space-y-2">
                  {categoryChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <div className="font-medium">{check.name}</div>
                          {check.message && (
                            <div className="text-sm text-gray-600">{check.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {check.duration && (
                          <span className="text-xs text-gray-500">{check.duration}ms</span>
                        )}
                        {getStatusBadge(check.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};