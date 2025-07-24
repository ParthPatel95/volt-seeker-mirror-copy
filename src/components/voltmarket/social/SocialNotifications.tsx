import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, UserPlus, Building, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useVoltMarketSocialNotifications } from '@/hooks/useVoltMarketSocialNotifications';

export const SocialNotifications = () => {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useVoltMarketSocialNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      default:
        return <Building className="w-4 h-4 text-gray-500" />;
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Activity Feed</span>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </CardTitle>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    !notification.read 
                      ? 'bg-primary/5 border-l-2 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          {getActionText(notification.type, notification.user_profile, notification.post_content)}
                        </span>
                      </p>
                    </div>
                    
                    {notification.content && (
                      <p className="text-sm text-muted-foreground mt-1 ml-8">
                        "{notification.content}"
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-2 ml-8">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
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