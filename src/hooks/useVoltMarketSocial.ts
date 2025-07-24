import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  related_listing_id?: string;
  hashtags?: string[];
  media_urls?: string[];
  visibility: string;
  created_at: string;
  updated_at: string;
  user_profile?: {
    company_name?: string;
    role?: string;
  };
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

interface SocialInteraction {
  id: string;
  user_id: string;
  post_id: string;
  interaction_type: string;
  content?: string;
  created_at: string;
}

interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export const useVoltMarketSocial = () => {
  const { profile } = useVoltMarketAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts with user profiles and interaction counts
  const fetchPosts = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('voltmarket_social_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      // Get interaction counts and user's likes for each post
      const postsWithInteractions = await Promise.all(
        (postsData || []).map(async (post) => {
          // Get user profile
          const { data: userProfile } = await supabase
            .from('voltmarket_profiles')
            .select('company_name, role')
            .eq('user_id', post.user_id)
            .single();

          // Get likes count
          const { count: likesCount } = await supabase
            .from('voltmarket_social_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('interaction_type', 'like');

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('voltmarket_social_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('interaction_type', 'comment');

          // Check if current user liked this post
          const { data: userLike } = await supabase
            .from('voltmarket_social_interactions')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', profile.id)
            .eq('interaction_type', 'like')
            .single();

          return {
            ...post,
            user_profile: userProfile,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            is_liked: !!userLike
          };
        })
      );

      setPosts(postsWithInteractions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (content: string, postType: string = 'text', hashtags?: string[]) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('voltmarket_social_posts')
        .insert({
          user_id: profile.id,
          content,
          post_type: postType,
          hashtags: hashtags || [],
          visibility: 'public'
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh posts after creating
      await fetchPosts();
      return data;
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Like/unlike a post
  const toggleLike = async (postId: string) => {
    if (!profile) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('voltmarket_social_interactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', profile.id)
        .eq('interaction_type', 'like')
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('voltmarket_social_interactions')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like
        await supabase
          .from('voltmarket_social_interactions')
          .insert({
            user_id: profile.id,
            post_id: postId,
            interaction_type: 'like'
          });
      }

      // Refresh posts to update counts
      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Add comment to post
  const addComment = async (postId: string, content: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('voltmarket_social_interactions')
        .insert({
          user_id: profile.id,
          post_id: postId,
          interaction_type: 'comment',
          content
        });

      if (error) throw error;

      // Refresh posts to update counts
      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Follow/unfollow user
  const toggleFollow = async (userId: string) => {
    if (!profile) return;

    try {
      // Check if already following
      const { data: existingFollow } = await supabase
        .from('voltmarket_follows')
        .select('id')
        .eq('follower_id', profile.id)
        .eq('following_id', userId)
        .single();

      if (existingFollow) {
        // Unfollow
        await supabase
          .from('voltmarket_follows')
          .delete()
          .eq('id', existingFollow.id);
      } else {
        // Follow
        await supabase
          .from('voltmarket_follows')
          .insert({
            follower_id: profile.id,
            following_id: userId
          });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Get user's followers count
  const getFollowersCount = async (userId: string) => {
    const { count } = await supabase
      .from('voltmarket_follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);
    
    return count || 0;
  };

  // Get user's following count
  const getFollowingCount = async (userId: string) => {
    const { count } = await supabase
      .from('voltmarket_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);
    
    return count || 0;
  };

  useEffect(() => {
    if (profile) {
      fetchPosts();
    }
  }, [profile]);

  return {
    posts,
    loading,
    error,
    createPost,
    toggleLike,
    addComment,
    toggleFollow,
    getFollowersCount,
    getFollowingCount,
    refreshPosts: fetchPosts
  };
};