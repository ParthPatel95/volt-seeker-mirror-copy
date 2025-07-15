import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LiveDataSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Live Market Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings</CardTitle>
              <CardDescription>Current market opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250+</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Capacity</CardTitle>
              <CardDescription>Available power capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.2 GW</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Completed this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4B</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveDataSection;