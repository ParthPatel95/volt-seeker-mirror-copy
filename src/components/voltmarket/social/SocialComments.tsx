import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Building, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_profile?: {
    company_name?: string;
    role?: string;
  };
}

interface SocialCommentsProps {
  postId: string;
  onCommentAdded?: () => void;
}

export const SocialComments = ({ postId, onCommentAdded }: SocialCommentsProps) => {
  const { profile } = useVoltMarketAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const { data: interactions } = await supabase
        .from('voltmarket_social_interactions')
        .select('*')
        .eq('post_id', postId)
        .eq('interaction_type', 'comment')
        .order('created_at', { ascending: true });

      if (!interactions) return;

      // Enrich with user profiles
      const enrichedComments = await Promise.all(
        interactions.map(async (interaction) => {
          const { data: userProfile } = await supabase
            .from('voltmarket_profiles')
            .select('company_name, role')
            .eq('user_id', interaction.user_id)
            .single();

          return {
            id: interaction.id,
            user_id: interaction.user_id,
            content: interaction.content || '',
            created_at: interaction.created_at,
            user_profile: userProfile
          };
        })
      );

      setComments(enrichedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async () => {
    if (!profile || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('voltmarket_social_interactions')
        .insert({
          user_id: profile.id,
          post_id: postId,
          interaction_type: 'comment',
          content: newComment
        });

      if (error) throw error;

      setNewComment('');
      await fetchComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Reply className="w-4 h-4 mr-1" />
          {comments.length > 0 ? `${comments.length} comments` : 'Comment'}
        </Button>
      </div>

      {showComments && (
        <div className="space-y-3 pl-4 border-l-2 border-muted">
          {/* Add comment form */}
          {profile && (
            <div className="space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={addComment}
                  disabled={!newComment.trim() || loading}
                >
                  {loading ? 'Posting...' : 'Comment'}
                </Button>
              </div>
            </div>
          )}

          {/* Comments list */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {comment.user_profile?.company_name || 'Unknown Company'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {comment.user_profile?.role || 'Professional'}
                  </p>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
};