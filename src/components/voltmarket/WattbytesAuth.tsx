import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WattbytesAuth = () => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>WattBytes Authentication</CardTitle>
        <CardDescription>Sign in to access VoltMarket</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full">Sign In</Button>
        <Button variant="outline" className="w-full">Create Account</Button>
      </CardContent>
    </Card>
  );
};

export default WattbytesAuth;