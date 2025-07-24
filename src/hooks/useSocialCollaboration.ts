import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  attachments: any[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  visibility: string;
  tags: string[];
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  channel_id?: string;
  content: string;
  message_type: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}

interface CollaborationChannel {
  id: string;
  name: string;
  description: string;
  channel_type: string;
  created_by: string;
  member_count: number;
  created_at: string;
}

export const useSocialCollaboration = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<CollaborationChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Create a new social post
  const createPost = async (postData: {
    content: string;
    post_type?: string;
    attachments?: any[];
    visibility?: string;
    tags?: string[];
  }) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('social-collaboration', {
        body: {
          action: 'create_post',
          data: {
            user_id: user.id,
            ...postData
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Post Created",
        description: "Your post has been shared successfully!",
      });

      // Refresh posts
      await loadFeed();
      
      return data.post;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load social media feed
  const loadFeed = async (postType?: string, limit = 20, offset = 0) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('social-collaboration', {
        body: {
          action: 'get_feed',
          data: {
            user_id: user.id,
            post_type: postType,
            limit,
            offset
          }
        }
      });

      if (error) throw error;

      if (offset === 0) {
        setPosts(data.posts || []);
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }
      
      return data.posts;
    } catch (error: any) {
      console.error('Error loading feed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load feed",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Interact with a post (like, comment, share)
  const interactWithPost = async (postId: string, interactionType: string, content?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('social-collaboration', {
        body: {
          action: 'interact_with_post',
          data: {
            user_id: user.id,
            target_id: postId,
            interaction_type: interactionType,
            content
          }
        }
      });

      if (error) throw error;

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const updatedPost = { ...post };
          if (interactionType === 'like') {
            updatedPost.likes_count += 1;
          } else if (interactionType === 'comment') {
            updatedPost.comments_count += 1;
          }
          return updatedPost;
        }
        return post;
      }));

      return data.interaction;
    } catch (error: any) {
      console.error('Error interacting with post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to interact with post",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Send a message
  const sendMessage = async (messageData: {
    recipient_id?: string;
    channel_id?: string;
    content: string;
    message_type?: string;
    attachments?: any[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('social-collaboration', {
        body: {
          action: 'send_message',
          data: {
            sender_id: user.id,
            ...messageData
          }
        }
      });

      if (error) throw error;

      // Update local messages
      setMessages(prev => [data.message, ...prev]);
      
      return data.message;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Load messages
  const loadMessages = async (channelId?: string, recipientId?: string, limit = 50) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('social-collaboration', {
        body: {
          action: 'get_messages',
          data: {
            user_id: user.id,
            channel_id: channelId,
            recipient_id: recipientId,
            limit
          }
        }
      });

      if (error) throw error;

      setMessages(data.messages || []);
      return data.messages;
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load messages",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a collaboration channel
  const createChannel = async (channelData: {
    name: string;
    description?: string;
    channel_type?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('social-collaboration', {
        body: {
          action: 'create_channel',
          data: {
            created_by: user.id,
            ...channelData
          }
        }
      });

      if (error) throw error;

      setChannels(prev => [...prev, data.channel]);
      
      toast({
        title: "Channel Created",
        description: `Channel "${channelData.name}" has been created successfully!`,
      });
      
      return data.channel;
    } catch (error: any) {
      console.error('Error creating channel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create channel",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Join a channel
  const joinChannel = async (channelId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('social-collaboration', {
        body: {
          action: 'join_channel',
          data: {
            channel_id: channelId,
            user_id: user.id
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Joined Channel",
        description: "You have successfully joined the channel!",
      });
      
      return data.membership;
    } catch (error: any) {
      console.error('Error joining channel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join channel",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    posts,
    messages,
    channels,
    loading,
    createPost,
    loadFeed,
    interactWithPost,
    sendMessage,
    loadMessages,
    createChannel,
    joinChannel,
  };
};