import React, { useState, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useSocialNetwork, type SocialPost } from '@/hooks/useSocialNetwork';
import { CommentSection } from './CommentSection';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Verified,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PostCardProps {
  post: SocialPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { likePost, unlikePost, repost, deletePost } = useSocialNetwork();
  const [showComments, setShowComments] = useState(false);
  
  // Get current user to check if they can delete the post
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  const handleLike = () => {
    if (post.is_liked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleRepost = () => {
    repost(post.id);
  };

  const handleDelete = () => {
    deletePost(post.id);
  };

  const canDeletePost = currentUser?.id === post.user_id;

  // Safe content rendering with XSS protection
  const safeContent = useMemo(() => {
    let content = post.content;
    
    // First sanitize the content to prevent XSS
    content = DOMPurify.sanitize(content, { 
      ALLOWED_TAGS: ['br'],
      ALLOWED_ATTR: []
    });
    
    // Then apply safe highlighting for hashtags and mentions
    if (post.hashtags) {
      post.hashtags.forEach(hashtag => {
        // Escape the hashtag to prevent regex injection
        const escapedHashtag = hashtag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        content = content.replace(
          new RegExp(`#${escapedHashtag}`, 'gi'),
          `<span class="text-watt-primary font-medium">#${hashtag}</span>`
        );
      });
    }

    if (post.mentions) {
      post.mentions.forEach(mention => {
        // Escape the mention to prevent regex injection
        const escapedMention = mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        content = content.replace(
          new RegExp(`@${escapedMention}`, 'gi'),
          `<span class="text-watt-primary font-medium">@${mention}</span>`
        );
      });
    }

    // Final sanitization after adding our safe markup
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['span', 'br'],
      ALLOWED_ATTR: ['class']
    });
  }, [post.content, post.hashtags, post.mentions]);

  const displayName = post.social_profiles?.display_name || post.profiles?.full_name || 'Anonymous';
  const username = post.social_profiles?.username || 'anonymous';
  const avatarUrl = post.social_profiles?.avatar_url || post.profiles?.avatar_url;
  const isVerified = post.social_profiles?.verified || false;

  return (
    <Card className="border-0 border-b rounded-none hover:bg-muted/30 transition-colors">
      <div className="p-4">
        <div className="flex space-x-3">
          {/* Avatar */}
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex items-center space-x-1">
                <button 
                  className="font-bold text-sm hover:underline cursor-pointer"
                  onClick={() => {
                    // TODO: Navigate to user profile
                    console.log('Navigate to user:', post.user_id);
                  }}
                >
                  {displayName}
                </button>
                {isVerified && (
                  <Verified className="w-4 h-4 text-watt-primary fill-current" />
                )}
              </div>
              <span className="text-muted-foreground text-sm">@{username}</span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Copy link</DropdownMenuItem>
                    <DropdownMenuItem>Report post</DropdownMenuItem>
                    {canDeletePost && (
                      <>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete post
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete post?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your post.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content */}
            <div 
              className="text-sm mb-3 whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            {/* Attachments */}
            {post.attachments && post.attachments.images && (
              <div className="grid grid-cols-2 gap-2 mb-3 rounded-lg overflow-hidden">
                {post.attachments.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.hashtags.map((hashtag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{hashtag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between max-w-md">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-watt-primary hover:bg-watt-primary/10 h-8 px-2"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">{post.comments_count || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-accent hover:bg-accent/10 h-8 px-2"
                onClick={handleRepost}
              >
                <Repeat2 className="w-4 h-4 mr-1" />
                <span className="text-xs">{post.reposts_count || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${
                  post.is_liked
                    ? 'text-destructive hover:text-destructive hover:bg-destructive/10'
                    : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                }`}
                onClick={handleLike}
              >
                <Heart 
                  className={`w-4 h-4 mr-1 ${post.is_liked ? 'fill-current' : ''}`} 
                />
                <span className="text-xs">{post.likes_count}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-watt-primary hover:bg-watt-primary/10 h-8 px-2"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>

            {/* Comments Section */}
            <CommentSection 
              postId={post.id} 
              isOpen={showComments} 
              onClose={() => setShowComments(false)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};