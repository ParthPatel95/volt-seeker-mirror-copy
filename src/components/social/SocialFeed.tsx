import React, { useState } from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { PostCard } from './PostCard';
import { ComposePost } from './ComposePost';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SocialFeedProps {
  onUserClick?: (userId: string) => void;
}

export const SocialFeed = ({ onUserClick }: SocialFeedProps) => {
  const { posts, loading, loadFeed } = useSocialNetwork();
  const [showCompose, setShowCompose] = useState(false);

  const handleRefresh = () => {
    loadFeed();
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Home</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Compose Section - Desktop */}
      <div className="border-b p-4 hidden lg:block">
        <ComposePost compact onPost={loadFeed} />
      </div>

      {/* Floating Compose Button - Mobile */}
      <Button
        onClick={() => setShowCompose(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-watt-gradient shadow-lg z-50 lg:hidden"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Feed */}
      <div className="space-y-0">
        {loading && posts.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin text-watt-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-lg font-semibold mb-2">Welcome to VoltMarket Social!</h3>
            <p className="text-muted-foreground mb-4">
              Start following people or create your first post to see content here.
            </p>
            <Button 
              onClick={() => setShowCompose(true)}
              className="bg-watt-gradient"
            >
              Create Your First Post
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onUserClick={onUserClick} />
          ))
        )}
      </div>

      {/* Mobile Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-background z-50 lg:hidden">
          <ComposePost 
            onClose={() => setShowCompose(false)} 
            onPost={() => {
              setShowCompose(false);
              loadFeed();
            }}
          />
        </div>
      )}
    </div>
  );
};