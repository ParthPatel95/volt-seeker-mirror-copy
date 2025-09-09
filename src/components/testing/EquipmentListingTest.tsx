import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, TestTube, CheckCircle, XCircle } from 'lucide-react';

export const EquipmentListingTest: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const { user } = useVoltMarketAuth();
  const { toast } = useToast();

  const [testData] = useState({
    title: 'Test Equipment - Antminer S19 Pro (AUTO-GENERATED)',
    location: 'Austin, TX',
    equipment_type: 'asic',
    brand: 'Bitmain',
    model: 'Antminer S19 Pro',
    equipment_condition: 'new',
    quantity: 10,
    manufacture_year: 2024,
    asking_price: 2500,
    shipping_terms: 'Free shipping within continental US. 30-day warranty included.',
    description: 'Brand new Antminer S19 Pro miners. Excellent condition, never used. Perfect for mining operations.'
  });

  const createTestEquipmentListing = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create test listings",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setTestResult(null);

    try {
      // Create the equipment listing
      const { data: listing, error } = await supabase
        .from('voltmarket_listings')
        .insert({
          ...testData,
          listing_type: 'equipment',
          seller_id: user.id,
          status: 'active',
          power_capacity_mw: 0, // Not applicable for equipment
          available_power_mw: 0,
          square_footage: 0
        })
        .select()
        .single();

      if (error) throw error;

      setTestResult('success');
      setTestMessage(`Successfully created test equipment listing: ${listing.id}`);
      
      toast({
        title: "Test Equipment Listing Created",
        description: "Successfully created test equipment listing with all fields",
      });

    } catch (error: any) {
      console.error('Error creating test equipment listing:', error);
      setTestResult('error');
      setTestMessage(`Failed to create listing: ${error.message}`);
      
      toast({
        title: "Error Creating Test Listing",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const cleanupTestListings = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('voltmarket_listings')
        .delete()
        .eq('seller_id', user.id)
        .ilike('title', '%AUTO-GENERATED%');

      if (error) throw error;

      toast({
        title: "Cleanup Complete",
        description: "Removed all auto-generated test listings"
      });
    } catch (error: any) {
      toast({
        title: "Cleanup Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to test equipment listing functionality</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Equipment Listing Backend Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Equipment Type:</strong> {testData.equipment_type}</div>
          <div><strong>Brand:</strong> {testData.brand}</div>
          <div><strong>Model:</strong> {testData.model}</div>
          <div><strong>Condition:</strong> {testData.equipment_condition}</div>
          <div><strong>Quantity:</strong> {testData.quantity}</div>
          <div><strong>Price:</strong> ${testData.asking_price.toLocaleString()}</div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={createTestEquipmentListing}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? 'Creating...' : 'Create Test Equipment Listing'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={cleanupTestListings}
          >
            Cleanup Test Listings
          </Button>
        </div>

        {testResult && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            testResult === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {testResult === 'success' ? 
              <CheckCircle className="w-5 h-5" /> : 
              <XCircle className="w-5 h-5" />
            }
            <span className="text-sm">{testMessage}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          This test creates a sample equipment listing to verify that all equipment-specific fields 
          are properly stored and retrieved from the database.
        </div>
      </CardContent>
    </Card>
  );
};