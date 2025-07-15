import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InvestmentThesisSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Investment Thesis</h2>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Why Energy Infrastructure Now?</CardTitle>
            <CardDescription>The compelling case for energy asset investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Market Drivers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Energy transition acceleration</li>
                  <li>• Grid modernization needs</li>
                  <li>• Regulatory support</li>
                  <li>• Technology cost reductions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Investment Advantages</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Stable cash flows</li>
                  <li>• Long-term contracts</li>
                  <li>• Inflation protection</li>
                  <li>• ESG alignment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InvestmentThesisSection;