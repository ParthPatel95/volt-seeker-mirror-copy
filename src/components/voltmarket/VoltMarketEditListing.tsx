import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const VoltMarketEditListing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Edit Listing</h2>
        <p className="text-muted-foreground">Update your energy asset listing</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Asset Details</CardTitle>
          <CardDescription>Modify your energy asset information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" defaultValue="Solar Farm - Site 1" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" defaultValue="25 MW solar installation with grid connection" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Asking Price ($)</Label>
              <Input id="price" type="number" defaultValue="2500000" />
            </div>
            <div>
              <Label htmlFor="capacity">Power Capacity (MW)</Label>
              <Input id="capacity" type="number" defaultValue="25" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="Texas, USA" />
            </div>
            <div>
              <Label htmlFor="type">Asset Type</Label>
              <Input id="type" defaultValue="Solar" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button>Update Listing</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoltMarketEditListing;