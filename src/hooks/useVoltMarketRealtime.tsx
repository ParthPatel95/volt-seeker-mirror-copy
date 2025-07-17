import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

interface RealtimeMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const useVoltMarketRealtime = () => {
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useVoltMarketAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time messages
    const messagesChannel = supabase
      .channel('voltmarket_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'voltmarket_messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as RealtimeMessage;
          setMessages((prev) => [newMessage, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, is_read: true } : msg
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return {
    messages,
    unreadCount,
    markAsRead,
  };
};