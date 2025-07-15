import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const VoltMarketWatchlist = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Watchlist</h2>
        <p className="text-muted-foreground">Keep track of interesting energy assets</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Solar Farm - Site 1', price: '$2.5M', capacity: '25 MW', location: 'Texas', status: 'Active' },
          { title: 'Wind Farm - Mountain View', price: '$5.2M', capacity: '50 MW', location: 'Oklahoma', status: 'Active' },
          { title: 'Data Center - Phoenix', price: '$8.1M', capacity: '15 MW', location: 'Arizona', status: 'Under LOI' },
          { title: 'Solar + Storage - Nevada', price: '$3.8M', capacity: '30 MW', location: 'Nevada', status: 'Active' }
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.capacity} capacity</CardDescription>
                </div>
                <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-semibold">{item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{item.location}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">View Details</Button>
                <Button size="sm" variant="outline">Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VoltMarketWatchlist;