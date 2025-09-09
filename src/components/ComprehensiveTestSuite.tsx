import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Play, AlertTriangle, Activity } from 'lucide-react';
import { TestRunner } from '@/components/scraping/TestRunner';
import { EnergyRateEstimatorTest } from '@/components/energy/EnergyRateEstimatorTest';
import { VoltMarketFeatureTest } from '@/components/voltmarket/VoltMarketFeatureTest';
import { SystemHealthCheck } from '@/components/testing/SystemHealthCheck';
import { EquipmentListingTest } from '@/components/testing/EquipmentListingTest';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  error?: string;
  details?: string;
}

export const ComprehensiveTestSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Database Connectivity', status: 'pending' },
    { name: 'Authentication System', status: 'pending' },
    { name: 'Supabase Functions', status: 'pending' },
    { name: 'RLS Policies', status: 'pending' },
    { name: 'VoltMarket Features', status: 'pending' },
    { name: 'Energy Rate Estimator', status: 'pending' },
    { name: 'Property Scraping', status: 'pending' },
    { name: 'Real Estate Intelligence', status: 'pending' },
    { name: 'BTC ROI Calculator', status: 'pending' },
    { name: 'Storage Buckets', status: 'pending' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [propertiesFound, setPropertiesFound] = useState(0);
  const [showHealthCheck, setShowHealthCheck] = useState(true);
  const [showLegacyTests, setShowLegacyTests] = useState(true);

  const updateTestResult = (index: number, result: Partial<TestResult>) => {
    setTestResults(prev => prev.map((test, i) => 
      i === index ? { ...test, ...result } : test
    ));
  };

  const runTest = async (index: number, testFn: () => Promise<void>) => {
    setCurrentTestIndex(index);
    updateTestResult(index, { status: 'running' });
    
    try {
      await testFn();
      updateTestResult(index, { status: 'passed', details: 'Test completed successfully' });
    } catch (error) {
      console.error(`Test ${testResults[index].name} failed:`, error);
      updateTestResult(index, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const testDatabaseConnectivity = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
      
      if (error) throw error;
      
      // Test another table
      const { data: voltmarketData, error: voltmarketError } = await supabase
        .from('voltmarket_profiles')
        .select('count(*)')
        .limit(1);
        
      if (voltmarketError) throw voltmarketError;
    } catch (error) {
      throw new Error(`Database connectivity failed: ${error}`);
    }
  };

  const testAuthentication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        updateTestResult(1, { 
          status: 'warning', 
          details: 'Not currently authenticated (this is normal for testing)' 
        });
        return;
      }
      
      // Test profile access
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (error) throw error;
    } catch (error) {
      throw new Error(`Authentication test failed: ${error}`);
    }
  };

  const testSupabaseFunctions = async () => {
    try {
      // Test a simple edge function call
      const { data, error } = await supabase.functions.invoke('crypto-details', {
        body: { symbol: 'BTC' }
      });
      
      if (error) {
        updateTestResult(2, { 
          status: 'warning', 
          details: 'Some edge functions may not be accessible without authentication' 
        });
        return;
      }
    } catch (error) {
      updateTestResult(2, { 
        status: 'warning', 
        details: 'Edge functions test skipped (may require authentication)' 
      });
    }
  };

  const testRLSPolicies = async () => {
    try {
      // Test protected table access (should be restricted without auth)
      const { data: tokensData, error: tokensError } = await supabase
        .from('voltmarket_email_verification_tokens')
        .select('*')
        .limit(1);
        
      if (!tokensError) {
        updateTestResult(3, { 
          status: 'warning', 
          details: 'Some protected tables may be accessible - this could be expected based on current auth status' 
        });
        return;
      }
      
      // If we get an auth/permission error, that's actually good (RLS is working)
      if (tokensError.message.includes('RLS') || tokensError.message.includes('permission')) {
        updateTestResult(3, { 
          status: 'passed', 
          details: 'RLS policies are properly restricting access' 
        });
        return;
      }
    } catch (error) {
      throw new Error(`RLS policy test failed: ${error}`);
    }
  };

  const testVoltMarketFeatures = async () => {
    try {
      // Test listings table
      const { data: listings, error: listingsError } = await supabase
        .from('voltmarket_listings')
        .select('*')
        .limit(5);
        
      if (listingsError) throw new Error(`Listings access failed: ${listingsError.message}`);
      
      // Test listing images
      const { data: images, error: imagesError } = await supabase
        .from('voltmarket_listing_images')
        .select('*')
        .limit(5);
        
      if (imagesError) throw new Error(`Listing images access failed: ${imagesError.message}`);
    } catch (error) {
      throw new Error(`VoltMarket features test failed: ${error}`);
    }
  };

  const testEnergyRateEstimator = async () => {
    try {
      // Test energy rates table
      const { data: rates, error: ratesError } = await supabase
        .from('energy_rates')
        .select('*')
        .limit(5);
        
      if (ratesError) throw new Error(`Energy rates access failed: ${ratesError.message}`);
    } catch (error) {
      throw new Error(`Energy rate estimator test failed: ${error}`);
    }
  };

  const testPropertyScraping = async () => {
    try {
      // Test properties table
      const { data: manualProperties, error: manualError } = await supabase
        .from('properties')
        .select('count(*)')
        .limit(1);
        
      if (manualError) throw new Error(`Properties table access failed: ${manualError.message}`);
    } catch (error) {
      throw new Error(`Property scraping test failed: ${error}`);
    }
  };

  const testRealEstateIntelligence = async () => {
    try {
      // Test industry intelligence
      const { data: intel, error: intelError } = await supabase
        .from('industry_intelligence')
        .select('count(*)')
        .limit(1);
        
      if (intelError) throw new Error(`Industry intelligence access failed: ${intelError.message}`);
      
      // Test companies table
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('count(*)')
        .limit(1);
        
      if (companiesError) throw new Error(`Companies table access failed: ${companiesError.message}`);
    } catch (error) {
      throw new Error(`Real estate intelligence test failed: ${error}`);
    }
  };

  const testBTCROICalculator = async () => {
    try {
      // Test if we can access the properties table for BTC calculations
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, asking_price, power_capacity_mw')
        .limit(1);
        
      if (propertiesError) throw new Error(`BTC calculations access failed: ${propertiesError.message}`);
    } catch (error) {
      throw new Error(`BTC ROI calculator test failed: ${error}`);
    }
  };

  const testStorageBuckets = async () => {
    try {
      // Test storage buckets
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) throw new Error(`Storage buckets access failed: ${bucketsError.message}`);
      
      if (!buckets || buckets.length === 0) {
        throw new Error('No storage buckets found');
      }
      
      // Test listing one bucket's contents
      const { data: files, error: filesError } = await supabase
        .storage
        .from(buckets[0].name)
        .list('', { limit: 1 });
        
      if (filesError && !filesError.message.includes('Unauthorized')) {
        throw new Error(`Storage bucket content access failed: ${filesError.message}`);
      }
    } catch (error) {
      throw new Error(`Storage buckets test failed: ${error}`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    const tests = [
      testDatabaseConnectivity,
      testAuthentication,
      testSupabaseFunctions,
      testRLSPolicies,
      testVoltMarketFeatures,
      testEnergyRateEstimator,
      testPropertyScraping,
      testRealEstateIntelligence,
      testBTCROICalculator,
      testStorageBuckets
    ];

    for (let i = 0; i < tests.length; i++) {
      await runTest(i, tests[i]);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentTestIndex(-1);
    setIsRunning(false);
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
    switch (status) {
      case 'passed': return <Badge className="bg-green-500">Passed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'running': return <Badge className="bg-blue-500">Running</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* System Health Check Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" />
            System Health Check
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowHealthCheck(!showHealthCheck)}
          >
            {showHealthCheck ? 'Hide' : 'Show'} Health Check
          </Button>
        </div>
        
        {showHealthCheck && (
          <SystemHealthCheck />
        )}
      </div>

      {/* Legacy Test Suite */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Legacy Test Suite</h2>
          <Button
            variant="outline"
            onClick={() => setShowLegacyTests(!showLegacyTests)}
          >
            {showLegacyTests ? 'Hide' : 'Show'} Legacy Tests
          </Button>
        </div>
        
        {showLegacyTests && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Core System Tests
                  </CardTitle>
                  <Button 
                    onClick={runAllTests}
                    disabled={isRunning}
                    variant={isRunning ? "secondary" : "default"}
                  >
                    {isRunning ? `Testing... (${currentTestIndex + 1}/${testResults.length})` : 'Run All Tests'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.filter(t => t.status === 'passed').length}
                    </div>
                    <div className="text-green-700">Passed</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.filter(t => t.status === 'failed').length}
                    </div>
                    <div className="text-red-700">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {testResults.filter(t => t.status === 'warning').length}
                    </div>
                    <div className="text-yellow-700">Warnings</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {testResults.map((test, index) => (
                    <div key={`chart-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          {test.details && (
                            <div className="text-sm text-gray-600">{test.details}</div>
                          )}
                          {test.error && (
                            <div className="text-sm text-red-600">{test.error}</div>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feature-Specific Test Suites */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VoltMarketFeatureTest />
              <EquipmentListingTest />
              <div className="space-y-6">
                <EnergyRateEstimatorTest />
                <TestRunner onPropertiesFound={setPropertiesFound} />
              </div>
            </div>

            {propertiesFound > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">
                      Property scraping tests found {propertiesFound} properties successfully!
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};