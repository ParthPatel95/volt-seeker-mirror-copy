
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

interface RealtimeMessage {
  id: string;
  message: string;
  sender_id: string;
  recipient_id: string;
  listing_id: string;
  created_at: string;
  is_read: boolean;
}

interface RealtimeConversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
}

export const useVoltMarketRealtime = () => {
  const { profile } = useVoltMarketAuth();
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [conversations, setConversations] = useState<RealtimeConversation[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [newSocialPosts, setNewSocialPosts] = useState<any[]>([]);
  const [socialNotifications, setSocialNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;

    // Subscribe to real-time messages
    const messageChannel = supabase
      .channel('voltmarket-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'voltmarket_messages',
          filter: `recipient_id=eq.${profile.id}`
        },
        (payload) => {
          const newMessage = payload.new as RealtimeMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'voltmarket_messages',
          filter: `recipient_id=eq.${profile.id}`
        },
        (payload) => {
          const updatedMessage = payload.new as RealtimeMessage;
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id ? updatedMessage : msg
          ));
        }
      )
      .subscribe();

    // Subscribe to conversations
    const conversationChannel = supabase
      .channel('voltmarket-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voltmarket_conversations'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newConversation = payload.new as RealtimeConversation;
            if (newConversation.buyer_id === profile.id || newConversation.seller_id === profile.id) {
              setConversations(prev => [...prev, newConversation]);
            }
          }
        }
      )
      .subscribe();

    // Subscribe to social posts
    const socialPostsChannel = supabase
      .channel('voltmarket-social-posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'voltmarket_social_posts'
        },
        (payload) => {
          const newPost = payload.new;
          setNewSocialPosts(prev => [...prev, newPost]);
        }
      )
      .subscribe();

    // Subscribe to social interactions (for notifications)
    const socialInteractionsChannel = supabase
      .channel('voltmarket-social-interactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'voltmarket_social_interactions'
        },
        (payload) => {
          const interaction = payload.new;
          // Only notify if someone else interacted with current user's content
          if (interaction.user_id !== profile.id) {
            setSocialNotifications(prev => [...prev, {
              id: interaction.id,
              type: interaction.interaction_type,
              user_id: interaction.user_id,
              post_id: interaction.post_id,
              content: interaction.content,
              created_at: interaction.created_at,
              read: false
            }]);
          }
        }
      )
      .subscribe();

    // User presence tracking
    const presenceChannel = supabase
      .channel('voltmarket-presence')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = new Set(Object.keys(state));
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers(prev => new Set([...prev, key]));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: profile.id,
            online_at: new Date().toISOString(),
            company_name: profile.company_name
          });
        }
      });

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(conversationChannel);
      supabase.removeChannel(socialPostsChannel);
      supabase.removeChannel(socialInteractionsChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [profile]);

  return {
    messages,
    conversations,
    onlineUsers,
    newSocialPosts,
    socialNotifications,
    isUserOnline: (userId: string) => onlineUsers.has(userId),
    clearNewSocialPosts: () => setNewSocialPosts([]),
    markSocialNotificationAsRead: (notificationId: string) => {
      setSocialNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    }
  };
};
