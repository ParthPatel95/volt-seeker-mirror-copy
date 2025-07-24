import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, UserPlus, Building, Clock, Zap, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useVoltMarketSocialNotifications } from '@/hooks/useVoltMarketSocialNotifications';
import { useVoltMarketRealtime } from '@/hooks/useVoltMarketRealtime';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

export const SocialNotifications = () => {
  const { profile } = useVoltMarketAuth();
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useVoltMarketSocialNotifications();
  const { socialNotifications } = useVoltMarketRealtime();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-500" />
          </div>
        );
      case 'comment':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </div>
        );
      case 'follow':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-green-500" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Building className="w-4 h-4 text-gray-500" />
          </div>
        );
    }
  };

  const getActionText = (type: string, userProfile: any, postContent?: string) => {
    const company = userProfile?.company_name || 'Unknown Company';
    switch (type) {
      case 'like':
        return `${company} liked your post${postContent ? ': "' + postContent + '"' : ''}`;
      case 'comment':
        return `${company} commented on your post${postContent ? ': "' + postContent + '"' : ''}`;
      default:
        return `${company} interacted with your post`;
    }
  };

  if (!profile) {
    return (
      <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
        <CardContent className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-watt-gradient/10 rounded-full mb-4">
            <Bell className="w-8 h-8 text-watt-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground">Please sign in to view your activity notifications.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-watt-gradient flex items-center justify-center shadow-md">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Activity Feed</span>
                {unreadCount > 0 && (
                  <Badge className="ml-3 bg-watt-warning text-white">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
            </CardTitle>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                className="border-watt-primary/20 text-watt-primary hover:bg-watt-primary hover:text-white transition-all"
              >
                <Zap className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-watt-gradient rounded-full mb-4 animate-pulse">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <p className="text-muted-foreground font-medium">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-watt-gradient/10 rounded-full mb-4">
                <Bell className="w-8 h-8 text-watt-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No new notifications. When others interact with your posts, you'll see updates here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
                    !notification.read 
                      ? 'bg-watt-primary/5 border-l-4 border-watt-primary shadow-md hover:shadow-watt-glow/20' 
                      : 'bg-card hover:bg-watt-primary/5 border border-transparent hover:border-watt-primary/10'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-watt-gradient/10 flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-watt-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {getActionText(notification.type, notification.user_profile, notification.post_content)}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    
                    {notification.content && (
                      <div className="pl-11">
                        <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 italic">
                          "{notification.content}"
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!notification.read && (
                    <div className="absolute right-4 top-4">
                      <div className="w-3 h-3 bg-watt-primary rounded-full shadow-md animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};