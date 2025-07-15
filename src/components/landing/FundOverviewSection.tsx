import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FundOverviewSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Fund Overview</h2>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>VoltMarket Investment Fund</CardTitle>
            <CardDescription>Strategic investments in energy infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Investment Strategy</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Focus on renewable energy assets</li>
                  <li>• Strategic location selection</li>
                  <li>• Technology-driven approach</li>
                  <li>• Long-term value creation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Target Returns</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 15-20% IRR target</li>
                  <li>• 5-7 year investment horizon</li>
                  <li>• Diversified portfolio</li>
                  <li>• Risk-adjusted returns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FundOverviewSection;