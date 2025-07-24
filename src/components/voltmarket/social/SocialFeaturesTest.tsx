import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoltMarketSocial } from '@/hooks/useVoltMarketSocial';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { useVoltMarketSocialNotifications } from '@/hooks/useVoltMarketSocialNotifications';
import { useVoltMarketRealtime } from '@/hooks/useVoltMarketRealtime';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const SocialFeaturesTest = () => {
  const { profile, user, loading: authLoading } = useVoltMarketAuth();
  const { posts, loading: socialLoading, createPost, error: socialError } = useVoltMarketSocial();
  const { notifications, loading: notificationsLoading } = useVoltMarketSocialNotifications();
  const { newSocialPosts, socialNotifications } = useVoltMarketRealtime();

  const testResults = [
    {
      name: 'Authentication',
      status: user ? 'success' : 'warning',
      message: user ? 'User authenticated' : 'No user signed in',
    },
    {
      name: 'Profile',
      status: profile ? 'success' : 'warning', 
      message: profile ? `Profile loaded: ${profile.company_name || 'No company name'}` : 'No profile found',
    },
    {
      name: 'Social Hook',
      status: socialError ? 'error' : 'success',
      message: socialError ? `Error: ${socialError}` : `Posts loaded: ${posts.length}`,
    },
    {
      name: 'Notifications Hook',
      status: notificationsLoading ? 'loading' : 'success',
      message: notificationsLoading ? 'Loading...' : `Notifications: ${notifications.length}`,
    },
    {
      name: 'Realtime Updates',
      status: 'success',
      message: `New posts: ${newSocialPosts.length}, Social notifications: ${socialNotifications.length}`,
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const testCreatePost = async () => {
    if (!profile) {
      alert('Please sign in to test post creation');
      return;
    }

    try {
      await createPost('🧪 Test post from social features test suite! #Testing #SocialFeatures', 'text', ['#Testing', '#SocialFeatures']);
      alert('Test post created successfully!');
    } catch (error) {
      alert(`Error creating test post: ${error}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Social Features Test Suite</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Results */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Component Status</h3>
            {testResults.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{test.message}</span>
              </div>
            ))}
          </div>

          {/* Test Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={testCreatePost}
                disabled={!profile || socialLoading}
                className="w-full"
              >
                Test Create Post
              </Button>
              <Button 
                onClick={() => window.open('/social', '_blank')}
                variant="outline"
                className="w-full"
              >
                Open Social Page
              </Button>
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">Auth Status</div>
                <div className="text-muted-foreground">
                  {authLoading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">Posts Loaded</div>
                <div className="text-muted-foreground">{posts.length} posts</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">Notifications</div>
                <div className="text-muted-foreground">{notifications.length} total</div>
              </div>
            </div>
          </div>

          {/* Recent Posts Preview */}
          {posts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recent Posts Preview</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg text-sm">
                    <div className="font-medium">{post.user_profile?.company_name || 'Unknown'}</div>
                    <div className="text-muted-foreground mt-1">
                      {post.content.substring(0, 100)}
                      {post.content.length > 100 ? '...' : ''}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>❤️ {post.likes_count || 0}</span>
                      <span>💬 {post.comments_count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};