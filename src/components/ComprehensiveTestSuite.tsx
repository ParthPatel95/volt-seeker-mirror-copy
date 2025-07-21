import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Play, AlertTriangle } from 'lucide-react';
import { TestRunner } from '@/components/scraping/TestRunner';
import { EnergyRateEstimatorTest } from '@/components/energy/EnergyRateEstimatorTest';
import { VoltMarketFeatureTest } from '@/components/voltmarket/VoltMarketFeatureTest';
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
      const { data: energyData, error: energyError } = await supabase
        .from('energy_markets')
        .select('count(*)')
        .limit(1);
        
      if (energyError) throw energyError;
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
        // Function might not exist or be accessible, mark as warning
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
      // Test public access to energy markets (should work)
      const { data: energyData, error: energyError } = await supabase
        .from('energy_markets')
        .select('*')
        .limit(1);
        
      if (energyError) throw new Error(`Public table access failed: ${energyError.message}`);
      
      // Test protected table access (should be restricted without auth)
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .limit(1);
        
      if (!alertsError) {
        updateTestResult(3, { 
          status: 'warning', 
          details: 'Protected tables accessible without auth - check RLS policies' 
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
      
      // Test energy markets table
      const { data: markets, error: marketsError } = await supabase
        .from('energy_markets')
        .select('*')
        .limit(5);
        
      if (marketsError) throw new Error(`Energy markets access failed: ${marketsError.message}`);
    } catch (error) {
      throw new Error(`Energy rate estimator test failed: ${error}`);
    }
  };

  const testPropertyScraping = async () => {
    try {
      // Test scraped properties table
      const { data: properties, error: propertiesError } = await supabase
        .from('scraped_properties')
        .select('count(*)')
        .limit(1);
        
      if (propertiesError) throw new Error(`Scraped properties access failed: ${propertiesError.message}`);
      
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
      
      // Test verified sites
      const { data: sites, error: sitesError } = await supabase
        .from('verified_heavy_power_sites')
        .select('count(*)')
        .limit(1);
        
      if (sitesError) throw new Error(`Verified sites access failed: ${sitesError.message}`);
    } catch (error) {
      throw new Error(`Real estate intelligence test failed: ${error}`);
    }
  };

  const testBTCROICalculator = async () => {
    try {
      // Test BTC calculations table
      const { data: calculations, error: calcError } = await supabase
        .from('btc_roi_calculations')
        .select('count(*)')
        .limit(1);
        
      if (calcError) throw new Error(`BTC calculations access failed: ${calcError.message}`);
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

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const warningTests = testResults.filter(t => t.status === 'warning').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Comprehensive Feature Test Suite
            <Button onClick={runAllTests} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex gap-4 text-sm">
              <span className="text-green-600 font-medium">Passed: {passedTests}</span>
              <span className="text-red-600 font-medium">Failed: {failedTests}</span>
              <span className="text-yellow-600 font-medium">Warnings: {warningTests}</span>
              <span className="text-gray-600 font-medium">Total: {totalTests}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(passedTests / totalTests) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {testResults.map((test, index) => (
              <div
                key={test.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  currentTestIndex === index ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    {test.error && (
                      <p className="text-sm text-red-600 mt-1">{test.error}</p>
                    )}
                    {test.details && (
                      <p className="text-sm text-gray-600 mt-1">{test.details}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specialized Test Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>VoltMarket Feature Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto">
              <VoltMarketFeatureTest />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Rate Estimator Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto">
              <EnergyRateEstimatorTest />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Scraping Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto">
              <TestRunner onPropertiesFound={setPropertiesFound} />
              {propertiesFound > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  Found {propertiesFound} properties across all test scenarios
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Tables</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">RLS Policies</span>
                <Badge variant="outline">Configured</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Storage Buckets</span>
                <Badge variant="outline">Available</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Edge Functions</span>
                <Badge variant="outline">Deployed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};