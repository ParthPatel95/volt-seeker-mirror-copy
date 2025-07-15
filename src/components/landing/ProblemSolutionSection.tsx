import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProblemSolutionSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Problem & Solution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">The Problem</CardTitle>
              <CardDescription>Current challenges in energy markets</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Fragmented marketplace</li>
                <li>• Limited transparency</li>
                <li>• Complex transactions</li>
                <li>• High barriers to entry</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Our Solution</CardTitle>
              <CardDescription>How VoltMarket addresses these issues</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Unified platform</li>
                <li>• Real-time data</li>
                <li>• Streamlined processes</li>
                <li>• Accessible to all</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;