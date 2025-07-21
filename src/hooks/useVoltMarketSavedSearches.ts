import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  search_criteria: any;
  notifications_enabled: boolean;
  created_at: string;
  search_name?: string;
  notification_enabled?: boolean;
}

export const useVoltMarketSavedSearches = () => {
  const { profile } = useVoltMarketAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);

  const saveSearch = useCallback(async (searchName: string, searchCriteria: any, notificationsEnabled: boolean = false) => {
    if (!profile) return { data: null, error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('voltmarket_saved_searches')
        .insert({
          user_id: profile.user_id,
          name: searchName,
          search_criteria: searchCriteria,
          notifications_enabled: notificationsEnabled
        })
        .select()
        .single();

      if (error) throw error;
      
      setSavedSearches(prev => [...prev, data as SavedSearch]);
      return { data, error: null };
    } catch (error) {
      console.error('Error saving search:', error);
      return { data: null, error };
    }
  }, [profile]);

  const getSavedSearches = useCallback(async () => {
    if (!profile) return { data: null, error: 'Not authenticated' };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('voltmarket_saved_searches')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSavedSearches((data || []) as SavedSearch[]);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const deleteSearch = useCallback(async (searchId: string) => {
    if (!profile) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('voltmarket_saved_searches')
        .delete()
        .eq('id', searchId)
        .eq('user_id', profile.user_id);

      if (error) throw error;
      
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting search:', error);
      return { success: false, error };
    }
  }, [profile]);

  const updateNotificationSettings = useCallback(async (searchId: string, enabled: boolean) => {
    if (!profile) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('voltmarket_saved_searches')
        .update({ notifications_enabled: enabled })
        .eq('id', searchId)
        .eq('user_id', profile.user_id);

      if (error) throw error;
      
      setSavedSearches(prev => prev.map(search => 
        search.id === searchId ? { ...search, notifications_enabled: enabled } : search
      ));
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return { success: false, error };
    }
  }, [profile]);

  const loadSearch = useCallback(async (searchId: string) => {
    if (!profile) return { criteria: {}, error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('voltmarket_saved_searches')
        .select('search_criteria')
        .eq('id', searchId)
        .eq('user_id', profile.user_id)
        .single();

      if (error) throw error;
      
      return { criteria: data.search_criteria || {}, error: null };
    } catch (error) {
      console.error('Error loading search:', error);
      return { criteria: {}, error };
    }
  }, [profile]);

  return {
    savedSearches,
    loading,
    saveSearch,
    getSavedSearches,
    deleteSearch,
    updateNotificationSettings,
    loadSearch
  };
};