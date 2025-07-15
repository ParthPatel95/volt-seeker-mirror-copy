import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VoltMarketListings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Energy Asset Listings</h2>
        <p className="text-muted-foreground">Browse available energy infrastructure opportunities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>Solar Farm - Site {item}</CardTitle>
              <CardDescription>25 MW capacity available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>Texas, USA</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span>$2.5M</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>Solar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VoltMarketListings;