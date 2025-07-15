import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const VoltMarketEnhancedMessages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Enhanced Messages</h2>
        <p className="text-muted-foreground">Advanced messaging with real-time notifications</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { title: 'Solar Farm Inquiry', user: 'John Doe', unread: 2 },
                { title: 'Wind Farm Discussion', user: 'Jane Smith', unread: 0 },
                { title: 'Data Center Lease', user: 'Mike Johnson', unread: 1 },
                { title: 'LOI Follow-up', user: 'Sarah Wilson', unread: 0 }
              ].map((item, index) => (
                <div key={index} className="p-3 border rounded hover:bg-muted cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{item.title}</div>
                    {item.unread > 0 && (
                      <Badge variant="secondary" className="text-xs">{item.unread}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.user}</div>
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
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium text-sm">John Doe</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
                <div>Hi, I'm interested in your solar farm listing. Can you provide more details about the power purchase agreements?</div>
              </div>
              <div className="p-3 bg-primary text-primary-foreground rounded-lg ml-auto max-w-[80%]">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium text-sm">You</div>
                  <div className="text-xs opacity-80">1 hour ago</div>
                </div>
                <div>Thank you for your interest! The farm has a 20-year PPA with the local utility at competitive rates.</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium text-sm">John Doe</div>
                  <div className="text-xs text-muted-foreground">30 min ago</div>
                </div>
                <div>That sounds promising. Would it be possible to schedule a call to discuss the financial details?</div>
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

export default VoltMarketEnhancedMessages;