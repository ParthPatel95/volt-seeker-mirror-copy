import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LPPortalSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">LP Portal</h2>
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Limited Partner Access</CardTitle>
            <CardDescription>Exclusive portal for fund investors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">Portfolio Access</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Real-time performance</li>
                  <li>• Investment details</li>
                  <li>• Financial reports</li>
                  <li>• Market updates</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Exclusive Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Direct communication</li>
                  <li>• Quarterly calls</li>
                  <li>• Due diligence access</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
            <div className="text-center">
              <Button size="lg">Access Portal</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LPPortalSection;