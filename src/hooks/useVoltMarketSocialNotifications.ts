import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

interface SocialNotification {
  id: string;
  type: string;
  user_id: string;
  post_id: string;
  content?: string;
  created_at: string;
  read: boolean;
  user_profile?: {
    company_name?: string;
    role?: string;
  };
  post_content?: string;
}

export const useVoltMarketSocialNotifications = () => {
  const { profile } = useVoltMarketAuth();
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications for current user
  const fetchNotifications = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // Get interactions on user's posts
      const { data: userPosts } = await supabase
        .from('voltmarket_social_posts')
        .select('id')
        .eq('user_id', profile.id);

      if (!userPosts || userPosts.length === 0) {
        setNotifications([]);
        return;
      }

      const postIds = userPosts.map(post => post.id);

      // Get interactions from others on user's posts
      const { data: interactions } = await supabase
        .from('voltmarket_social_interactions')
        .select('*')
        .in('post_id', postIds)
        .neq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!interactions) return;

      // Enrich with user profiles and post content
      const enrichedNotifications = await Promise.all(
        interactions.map(async (interaction) => {
          // Get user profile
          const { data: userProfile } = await supabase
            .from('voltmarket_profiles')
            .select('company_name, role')
            .eq('user_id', interaction.user_id)
            .single();

          // Get post content (first 100 chars)
          const { data: post } = await supabase
            .from('voltmarket_social_posts')
            .select('content')
            .eq('id', interaction.post_id)
            .single();

          return {
            id: interaction.id,
            type: interaction.interaction_type,
            user_id: interaction.user_id,
            post_id: interaction.post_id,
            content: interaction.content,
            created_at: interaction.created_at,
            read: false, // TODO: Implement read status
            user_profile: userProfile,
            post_content: post?.content?.substring(0, 100) + (post?.content?.length > 100 ? '...' : '')
          };
        })
      );

      setNotifications(enrichedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  useEffect(() => {
    if (profile) {
      fetchNotifications();
    }
  }, [profile]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};