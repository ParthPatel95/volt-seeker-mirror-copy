import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const VoltMarketCreateListing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Create New Listing</h2>
        <p className="text-muted-foreground">List your energy asset on VoltMarket</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Asset Details</CardTitle>
          <CardDescription>Provide information about your energy asset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter listing title" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your energy asset" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Asking Price ($)</Label>
              <Input id="price" type="number" placeholder="Enter price" />
            </div>
            <div>
              <Label htmlFor="capacity">Power Capacity (MW)</Label>
              <Input id="capacity" type="number" placeholder="Enter capacity" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter location" />
            </div>
            <div>
              <Label htmlFor="type">Asset Type</Label>
              <Input id="type" placeholder="e.g., Solar, Wind, Data Center" />
            </div>
          </div>
          <Button>Create Listing</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoltMarketCreateListing;