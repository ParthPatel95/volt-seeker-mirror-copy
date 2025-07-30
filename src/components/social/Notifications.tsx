import React from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export const Notifications = () => {
  const { notifications } = useSocialNetwork();

  return (
    <div>
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4">
        <h2 className="text-xl font-bold">Notifications</h2>
      </div>

      <div className="space-y-0">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className="border-0 border-b rounded-none p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={notification.from_user?.avatar_url} />
                  <AvatarFallback>
                    {notification.from_user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{notification.from_user?.full_name}</span>{' '}
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};