import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VoltScoutSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">VoltScout</h2>
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Advanced Property Intelligence</CardTitle>
            <CardDescription>AI-powered property discovery and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Automated property scanning</li>
                  <li>• VoltScore analysis</li>
                  <li>• Market intelligence</li>
                  <li>• Risk assessment</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Benefits</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Time savings</li>
                  <li>• Better decisions</li>
                  <li>• Market insights</li>
                  <li>• Competitive advantage</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <Button size="lg">Explore VoltScout</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VoltScoutSection;