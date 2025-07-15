import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const VoltMarketVerificationCenter = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Verification Center</h2>
        <p className="text-muted-foreground">Manage your account verification status</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
            <CardDescription>Verify your identity to access premium features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="secondary">Verified</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Your identity has been successfully verified. You can now access all marketplace features.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Verification</CardTitle>
            <CardDescription>Verify your financial credentials for high-value transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-yellow-500" />
              <Badge variant="outline">Pending</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your financial verification is currently under review. This process typically takes 2-3 business days.
            </p>
            <Button variant="outline" size="sm">Check Status</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Business Verification</CardTitle>
            <CardDescription>Verify your business credentials for corporate transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-5 w-5 text-red-500" />
              <Badge variant="destructive">Not Started</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Business verification is required for transactions over $1M. Upload your business documents to get started.
            </p>
            <Button size="sm">Start Verification</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Accredited Investor</CardTitle>
            <CardDescription>Verify your accredited investor status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="secondary">Verified</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Your accredited investor status has been confirmed. You have access to exclusive investment opportunities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoltMarketVerificationCenter;