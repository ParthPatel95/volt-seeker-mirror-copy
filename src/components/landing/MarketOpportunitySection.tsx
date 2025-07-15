import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MarketOpportunitySection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Market Opportunity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>$2.5T</CardTitle>
              <CardDescription>Global energy market size</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Growing demand for renewable energy assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>15%</CardTitle>
              <CardDescription>Annual growth rate</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Expanding market opportunities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>500+</CardTitle>
              <CardDescription>Active participants</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Growing ecosystem of buyers and sellers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MarketOpportunitySection;