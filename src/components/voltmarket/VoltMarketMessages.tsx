import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const VoltMarketMessages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Messages</h2>
        <p className="text-muted-foreground">Communicate with buyers and sellers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="p-3 border rounded hover:bg-muted cursor-pointer">
                  <div className="font-medium">Solar Farm Inquiry</div>
                  <div className="text-sm text-muted-foreground">John Doe</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>Solar Farm Inquiry - John Doe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4 h-64 overflow-y-auto">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm mb-1">John Doe</div>
                <div>Hi, I'm interested in your solar farm listing. Can you provide more details about the power purchase agreements?</div>
              </div>
              <div className="p-3 bg-primary text-primary-foreground rounded-lg ml-auto max-w-[80%]">
                <div className="font-medium text-sm mb-1">You</div>
                <div>Thank you for your interest! The farm has a 20-year PPA with the local utility at competitive rates.</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoltMarketMessages;