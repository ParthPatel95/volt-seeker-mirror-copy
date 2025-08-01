import React, { useState, useEffect } from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  likes_count: number;
  is_liked: boolean;
  social_profiles?: {
    display_name?: string;
    username?: string;
    avatar_url?: string;
  };
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentSection = ({ postId, isOpen, onClose }: CommentSectionProps) => {
  const { createComment, getComments } = useSocialNetwork();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const commentsData = await getComments(postId);
      setComments(commentsData || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await createComment(postId, newComment);
      setNewComment('');
      await loadComments(); // Refresh comments
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="border-t bg-muted/30">
      {/* Comment Input */}
      <div className="p-4 border-b">
        <div className="flex space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={""} />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] resize-none border-0 bg-background focus-visible:ring-1"
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="bg-watt-gradient hover:opacity-90"
              >
                <Send className="w-4 h-4 mr-1" />
                {submitting ? 'Posting...' : 'Reply'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-0">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => {
  const displayName = comment.social_profiles?.display_name || comment.profiles?.full_name || 'Anonymous';
  const username = comment.social_profiles?.username || 'anonymous';
  const avatarUrl = comment.social_profiles?.avatar_url || comment.profiles?.avatar_url;

  return (
    <div className="p-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm">{displayName}</span>
            <span className="text-muted-foreground text-xs">@{username}</span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm whitespace-pre-wrap break-words mb-2">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs ${
                comment.is_liked
                  ? 'text-destructive hover:text-destructive'
                  : 'text-muted-foreground hover:text-destructive'
              }`}
            >
              <Heart className={`w-3 h-3 mr-1 ${comment.is_liked ? 'fill-current' : ''}`} />
              {comment.likes_count || 0}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};