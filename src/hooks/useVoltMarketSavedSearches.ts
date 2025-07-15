
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

interface SavedSearch {
  id: string;
  user_id: string;
  search_name: string;
  search_criteria: any;
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useVoltMarketSavedSearches = () => {
  const { profile } = useVoltMarketAuth();
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  const saveSearch = async (searchName: string, searchCriteria: any, notificationEnabled = true) => {
    if (!profile) throw new Error('Must be logged in');

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('voltmarket_saved_searches')
        .insert({
          user_id: profile.id,
          name: searchName,
          search_criteria: searchCriteria,
          notifications_enabled: notificationEnabled
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getSavedSearches = async () => {
    if (!profile) return { data: null, error: 'Not logged in' };

    try {
      const { data, error } = await supabase
        .from('voltmarket_saved_searches')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Map the data to match interface
      const mappedData = (data || []).map(item => ({
        ...item,
        search_name: item.name,
        notification_enabled: item.notifications_enabled,
        updated_at: item.created_at
      }));
      setSavedSearches(mappedData);
      return { data, error: null };
    } catch (error) {
      setSavedSearches([]);
      return { data: null, error };
    }
  };

  const loadSearch = async (searchId: string) => {
    if (!profile) return null;

    try {
      const { data, error } = await supabase
        .from('voltmarket_saved_searches')
        .select('*')
        .eq('id', searchId)
        .eq('user_id', profile.id)
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        criteria: data.search_criteria
      };
    } catch (error) {
      console.error('Error loading saved search:', error);
      return null;
    }
  };

  const deleteSearch = async (searchId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('voltmarket_saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateSearchNotifications = async (searchId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('voltmarket_saved_searches')
        .update({ notifications_enabled: enabled })
        .eq('id', searchId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    loading,
    savedSearches,
    saveSearch,
    getSavedSearches,
    loadSearch,
    deleteSearch,
    updateSearchNotifications
  };
};
