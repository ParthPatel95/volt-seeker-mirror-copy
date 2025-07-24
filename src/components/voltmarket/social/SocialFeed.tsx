import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Building, Zap, TrendingUp, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useVoltMarketSocial } from '@/hooks/useVoltMarketSocial';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { SocialComments } from './SocialComments';
import { toast } from '@/hooks/use-toast';

export const SocialFeed = () => {
  const { profile } = useVoltMarketAuth();
  const { posts, loading, createPost, toggleLike, refreshPosts } = useVoltMarketSocial();
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    // Extract hashtags from content
    const hashtags = newPostContent.match(/#\w+/g) || [];
    
    await createPost(newPostContent, 'text', hashtags);
    setNewPostContent('');
  };

  const handleCommentAdded = () => {
    refreshPosts();
  };

  const handleShare = async (post: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `GridBazaar Energy Network`,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Post link has been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view the social feed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Create Post - Enhanced Design */}
      <Card className="border border-watt-primary/10 shadow-lg hover:shadow-watt-glow/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-watt-gradient flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{profile.company_name || 'Your Company'}</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Zap className="w-3 h-3 mr-1 text-watt-primary" />
                {profile.role || 'Energy Professional'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share market insights, industry updates, or project announcements with the energy community..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[120px] resize-none border-watt-primary/20 focus:border-watt-primary/50 transition-colors"
          />
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="bg-watt-primary/10 text-watt-primary hover:bg-watt-primary/20">
                #SolarEnergy
              </Badge>
              <Badge variant="secondary" className="bg-watt-secondary/10 text-watt-secondary hover:bg-watt-secondary/20">
                #WindPower
              </Badge>
              <Badge variant="secondary" className="bg-watt-accent/10 text-watt-accent hover:bg-watt-accent/20">
                #GridInfrastructure
              </Badge>
            </div>
            <Button 
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
              className="bg-watt-gradient hover:opacity-90 text-white shadow-lg hover:shadow-watt-glow/30 transition-all duration-300 px-6"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Share Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed - Enhanced Design */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-watt-gradient rounded-full mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground font-medium">Loading energy network updates...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card className="border border-dashed border-watt-primary/30 bg-gradient-to-br from-card to-watt-light/5">
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-watt-gradient/10 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-watt-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start the Conversation</h3>
            <p className="text-muted-foreground">Be the first to share energy market insights with the community!</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card 
            key={post.id} 
            className="border border-watt-primary/10 hover:border-watt-primary/20 shadow-lg hover:shadow-watt-glow/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50 group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-watt-gradient flex items-center justify-center shadow-md group-hover:shadow-watt-glow/30 transition-all">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {post.user_profile?.company_name || 'Energy Company'}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                      <span>{post.user_profile?.role || 'Professional'}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                {post.post_type !== 'text' && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs font-medium ${
                      post.post_type === 'listing_announcement' 
                        ? 'bg-watt-accent/10 text-watt-accent border-watt-accent/20' 
                        : 'bg-watt-success/10 text-watt-success border-watt-success/20'
                    }`}
                  >
                    {post.post_type === 'listing_announcement' ? '🏭 New Listing' : '📊 Market Insight'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
              
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-xs bg-watt-primary/5 text-watt-primary border-watt-primary/20 hover:bg-watt-primary/10 cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Enhanced Interaction Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-watt-primary/10">
                <div className="flex items-center space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={`space-x-2 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
                      post.is_liked ? 'text-red-500 bg-red-50' : 'text-muted-foreground'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.likes_count || 0}</span>
                  </Button>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.comments_count || 0}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare(post)}
                    className="space-x-2 hover:bg-watt-primary/10 hover:text-watt-primary transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share</span>
                  </Button>
                </div>
                
                {post.post_type === 'listing_announcement' && (
                  <Button
                    size="sm"
                    className="bg-watt-gradient hover:opacity-90 text-white shadow-md hover:shadow-watt-glow/30 transition-all"
                  >
                    View Listing
                  </Button>
                )}
              </div>

              {/* Comments Section */}
              <SocialComments 
                postId={post.id} 
                onCommentAdded={handleCommentAdded}
              />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};