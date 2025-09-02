import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

export interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  attachments?: any;
  hashtags?: string[];
  mentions?: string[];
  post_type: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  reposts_count?: number;
  replies_count?: number;
  is_liked?: boolean;
  is_reposted?: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  social_profiles?: {
    username: string;
    display_name: string;
    avatar_url?: string;
    verified: boolean;
  };
}

export interface SocialProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  header_url?: string;
  location?: string;
  website?: string;
  verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  likes_count: number;
  is_following?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialComment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  social_profiles?: {
    username: string;
    display_name: string;
    avatar_url?: string;
    verified: boolean;
  };
}

export const useSocialNetwork = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const callSocialFunction = async (action: string, data: any) => {
    try {
      const response = await supabase.functions.invoke('social-network', {
        body: { action, data }
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      throw error;
    }
  };

  const loadFeed = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await callSocialFunction('get_feed', {
        user_id: user.id,
        limit: 20,
        offset: 0
      });
      
      if (result.success) {
        setPosts(result.posts);
      }
    } catch (error) {
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, attachments?: any, hashtags?: string[], mentions?: string[]) => {
    if (!user) return;

    try {
      const result = await callSocialFunction('create_post', {
        user_id: user.id,
        content,
        attachments,
        hashtags,
        mentions
      });

      if (result.success) {
        toast.success('Post created successfully!');
        loadFeed(); // Refresh feed
        return result.post;
      }
    } catch (error) {
      toast.error('Failed to create post');
      throw error;
    }
  };

  const likePost = async (post_id: string) => {
    if (!user) return;

    try {
      // Optimistic update
      setPosts(prev => prev.map(post => 
        post.id === post_id 
          ? { ...post, is_liked: true, likes_count: post.likes_count + 1 }
          : post
      ));

      await callSocialFunction('like_post', {
        user_id: user.id,
        post_id
      });
    } catch (error) {
      // Revert optimistic update
      setPosts(prev => prev.map(post => 
        post.id === post_id 
          ? { ...post, is_liked: false, likes_count: post.likes_count - 1 }
          : post
      ));
      toast.error('Failed to like post');
    }
  };

  const unlikePost = async (post_id: string) => {
    if (!user) return;

    try {
      // Optimistic update
      setPosts(prev => prev.map(post => 
        post.id === post_id 
          ? { ...post, is_liked: false, likes_count: post.likes_count - 1 }
          : post
      ));

      await callSocialFunction('unlike_post', {
        user_id: user.id,
        post_id
      });
    } catch (error) {
      // Revert optimistic update
      setPosts(prev => prev.map(post => 
        post.id === post_id 
          ? { ...post, is_liked: true, likes_count: post.likes_count + 1 }
          : post
      ));
      toast.error('Failed to unlike post');
    }
  };

  const repost = async (post_id: string, comment?: string) => {
    if (!user) return;

    try {
      await callSocialFunction('repost', {
        user_id: user.id,
        post_id,
        comment
      });

      toast.success('Post reposted!');
      loadFeed(); // Refresh feed
    } catch (error) {
      toast.error('Failed to repost');
    }
  };

  const followUser = async (following_id: string) => {
    if (!user) return;

    try {
      await callSocialFunction('follow_user', {
        follower_id: user.id,
        following_id
      });

      toast.success('User followed!');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const unfollowUser = async (following_id: string) => {
    if (!user) return;

    try {
      await callSocialFunction('unfollow_user', {
        follower_id: user.id,
        following_id
      });

      toast.success('User unfollowed');
    } catch (error) {
      toast.error('Failed to unfollow user');
    }
  };

  const createComment = async (post_id: string, content: string, parent_comment_id?: string) => {
    if (!user) return;

    try {
      const result = await callSocialFunction('create_comment', {
        user_id: user.id,
        post_id,
        content,
        parent_comment_id
      });

      if (result.success) {
        toast.success('Comment added!');
        return result.comment;
      }
    } catch (error) {
      toast.error('Failed to add comment');
      throw error;
    }
  };

  const getComments = async (post_id: string) => {
    try {
      const result = await callSocialFunction('get_comments', {
        post_id,
        limit: 20,
        offset: 0
      });

      if (result.success) {
        return result.comments;
      }
    } catch (error) {
      toast.error('Failed to load comments');
      return [];
    }
  };

  const searchPosts = async (query: string) => {
    if (!user) return [];

    try {
      const result = await callSocialFunction('search_posts', {
        query,
        user_id: user.id,
        limit: 20
      });

      if (result.success) {
        return result.posts;
      }
    } catch (error) {
      toast.error('Failed to search posts');
      return [];
    }
  };

  const loadTrendingHashtags = async () => {
    try {
      const result = await callSocialFunction('get_trending_hashtags', {
        limit: 10
      });

      if (result.success) {
        setTrendingHashtags(result.hashtags);
      }
    } catch (error) {
      console.error('Failed to load trending hashtags');
    }
  };

  const getUserProfile = async (user_id: string) => {
    try {
      const result = await callSocialFunction('get_user_profile', {
        user_id,
        current_user_id: user?.id
      });

      if (result.success) {
        return { profile: result.profile, posts: result.posts };
      }
    } catch (error) {
      toast.error('Failed to load user profile');
      return null;
    }
  };

  const updateProfile = async (profileData: Partial<SocialProfile>) => {
    if (!user) return;

    try {
      const result = await callSocialFunction('update_profile', {
        user_id: user.id,
        ...profileData
      });

      if (result.success) {
        setProfile(result.profile);
        toast.success('Profile updated!');
        return result.profile;
      }
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const result = await callSocialFunction('get_notifications', {
        user_id: user.id,
        limit: 20,
        offset: 0
      });

      if (result.success) {
        setNotifications(result.notifications);
      }
    } catch (error) {
      console.error('Failed to load notifications');
    }
  };

  const deletePost = async (postId: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to delete posts');
      return;
    }

    try {
      const result = await callSocialFunction('delete_post', {
        user_id: user.id,
        post_id: postId
      });

      if (result.error) {
        toast.error('Failed to delete post');
        return;
      }

      toast.success('Post deleted successfully');
      
      // Remove post from local state for immediate UI feedback
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  useEffect(() => {
    if (user) {
      loadFeed();
      loadTrendingHashtags();
      loadNotifications();
    }
  }, [user]);

  return {
    posts,
    profile,
    notifications,
    trendingHashtags,
    loading,
    createPost,
    likePost,
    unlikePost,
    repost,
    deletePost,
    followUser,
    unfollowUser,
    createComment,
    getComments,
    searchPosts,
    getUserProfile,
    updateProfile,
    loadFeed,
    loadNotifications
  };
};