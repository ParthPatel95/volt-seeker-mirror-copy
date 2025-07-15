import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const VoltMarketListingDetail = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Solar Farm - Site 1</h1>
          <p className="text-muted-foreground">Premium solar installation with grid connection</p>
        </div>
        <Badge variant="secondary">Active</Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Asking Price:</span>
              <span className="font-semibold">$2,500,000</span>
            </div>
            <div className="flex justify-between">
              <span>Power Capacity:</span>
              <span>25 MW</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>Texas, USA</span>
            </div>
            <div className="flex justify-between">
              <span>Asset Type:</span>
              <span>Solar</span>
            </div>
            <div className="flex justify-between">
              <span>Grid Connection:</span>
              <span>Yes</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Interact with this listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">Submit LOI</Button>
            <Button variant="outline" className="w-full">Contact Seller</Button>
            <Button variant="outline" className="w-full">Add to Watchlist</Button>
            <Button variant="outline" className="w-full">Request Due Diligence</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This premium 25 MW solar installation offers excellent investment potential with existing grid connection 
            and long-term power purchase agreements. Located in Texas with optimal solar irradiance and stable 
            regulatory environment. Asset includes modern solar panels, inverters, and monitoring systems.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoltMarketListingDetail;