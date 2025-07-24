import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Building } from 'lucide-react';
import { useState } from 'react';
import { useVoltMarketSocial } from '@/hooks/useVoltMarketSocial';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { formatDistanceToNow } from 'date-fns';

export const SocialFeed = () => {
  const { profile } = useVoltMarketAuth();
  const { posts, loading, createPost, toggleLike, addComment } = useVoltMarketSocial();
  const [newPostContent, setNewPostContent] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    // Extract hashtags from content
    const hashtags = newPostContent.match(/#\w+/g) || [];
    
    await createPost(newPostContent, 'text', hashtags);
    setNewPostContent('');
  };

  const handleAddComment = async (postId: string) => {
    if (!commentContent.trim()) return;
    
    await addComment(postId, commentContent);
    setCommentContent('');
    setCommentingOnPost(null);
  };

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view the social feed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{profile.company_name || 'Your Company'}</p>
              <p className="text-sm text-muted-foreground">{profile.role || 'Professional'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share an update, market insight, or industry news..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Use hashtags like #SolarEnergy #WindPower #EnergyInfrastructure
            </p>
            <Button 
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
              size="sm"
            >
              Post Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {post.user_profile?.company_name || 'Company'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {post.user_profile?.role || 'Professional'} • {' '}
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
                {post.post_type !== 'text' && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                    {post.post_type === 'listing_announcement' ? 'New Listing' : 'Market Insight'}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {post.content}
              </div>
              
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Interaction Buttons */}
              <div className="flex items-center space-x-6 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                  className={`space-x-2 ${post.is_liked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                  <span>{post.likes_count || 0}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCommentingOnPost(post.id)}
                  className="space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>

              {/* Comment Section */}
              {commentingOnPost === post.id && (
                <div className="space-y-3 pt-3 border-t">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCommentingOnPost(null);
                        setCommentContent('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentContent.trim()}
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};