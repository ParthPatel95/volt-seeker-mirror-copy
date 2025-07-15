import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VoltMarketHomepage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">VoltMarket</h1>
        <p className="text-muted-foreground">The future of energy asset marketplace</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Listings</CardTitle>
            <CardDescription>Current opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250+</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Capacity</CardTitle>
            <CardDescription>Available power</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2 GW</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4B</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoltMarketHomepage;