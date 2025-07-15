import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FundGrowthPlanSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Growth Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Phase 1</CardTitle>
              <CardDescription>Foundation (Year 1)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Platform development</li>
                <li>• Initial partnerships</li>
                <li>• Market entry</li>
                <li>• Team building</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Phase 2</CardTitle>
              <CardDescription>Expansion (Year 2-3)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Geographic expansion</li>
                <li>• Product diversification</li>
                <li>• Strategic acquisitions</li>
                <li>• Technology enhancement</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Phase 3</CardTitle>
              <CardDescription>Scale (Year 4-5)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Market leadership</li>
                <li>• Global presence</li>
                <li>• Innovation focus</li>
                <li>• Exit opportunities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FundGrowthPlanSection;