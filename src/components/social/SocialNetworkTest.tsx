import React, { useEffect, useState } from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export const SocialNetworkTest = () => {
  const { 
    posts, 
    loading, 
    createPost, 
    likePost, 
    unlikePost, 
    loadFeed 
  } = useSocialNetwork();
  
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
  }>>([]);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results = [];

    // Test 1: Load Feed
    try {
      await loadFeed();
      results.push({
        name: 'Load Feed',
        status: 'success' as const,
        message: `Successfully loaded ${posts.length} posts`
      });
    } catch (error) {
      results.push({
        name: 'Load Feed',
        status: 'error' as const,
        message: `Failed to load feed: ${error}`
      });
    }

    // Test 2: Create Post
    try {
      await createPost('🔋 Test post from the social network test suite! #testing #energy', null, ['testing', 'energy'], []);
      results.push({
        name: 'Create Post',
        status: 'success' as const,
        message: 'Successfully created test post'
      });
    } catch (error) {
      results.push({
        name: 'Create Post', 
        status: 'error' as const,
        message: `Failed to create post: ${error}`
      });
    }

    // Test 3: Like Post (if posts exist)
    if (posts.length > 0) {
      try {
        await likePost(posts[0].id);
        results.push({
          name: 'Like Post',
          status: 'success' as const,
          message: 'Successfully liked post'
        });
      } catch (error) {
        results.push({
          name: 'Like Post',
          status: 'error' as const,
          message: `Failed to like post: ${error}`
        });
      }
    }

    setTestResults(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Social Network Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Results */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {testResults.length === 0 ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running tests...</span>
              </div>
            ) : (
              testResults.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{test.message}</span>
                </div>
              ))
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Posts Loaded</div>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">
                {testResults.filter(t => t.status === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Tests Passed</div>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">
                {testResults.filter(t => t.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Tests Failed</div>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">
                {loading ? '⚡' : '✅'}
              </div>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading' : 'Ready'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Actions</h3>
            <div className="flex space-x-4">
              <Button onClick={runTests} disabled={loading}>
                Re-run Tests
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('/social', '_blank')}
              >
                Open Social Hub
              </Button>
            </div>
          </div>

          {/* Recent Posts */}
          {posts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recent Posts Sample</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">
                        {post.social_profiles?.display_name || post.profiles?.full_name || 'Unknown User'}
                      </span>
                      {post.social_profiles?.verified && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.content.substring(0, 150)}
                      {post.content.length > 150 ? '...' : ''}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>❤️ {post.likes_count || 0}</span>
                      <span>💬 {post.comments_count || 0}</span>
                      <span>🔄 {post.reposts_count || 0}</span>
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