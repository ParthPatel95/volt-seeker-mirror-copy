import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

export interface DueDiligenceReport {
  id: string;
  company_id?: string;
  listing_id?: string;
  report_type: string;
  executive_summary?: string;
  financial_analysis?: any;
  power_infrastructure_assessment?: any;
  risk_assessment?: any;
  valuation_analysis?: any;
  report_data?: any;
  recommendations?: string[];
  generated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DueDiligenceTask {
  id: string;
  listing_id: string;
  task_type: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  due_date?: string;
  completion_notes?: string;
  attachments?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useVoltMarketDueDiligence = () => {
  const { profile } = useVoltMarketAuth();
  const [loading, setLoading] = useState(false);

  const getDueDiligenceReports = async () => {
    if (!profile) return [];

    try {
      setLoading(true);
      // Using existing voltmarket_due_diligence table instead
      const { data, error } = await supabase
        .from('voltmarket_due_diligence')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching due diligence reports:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDueDiligenceTasks = async () => {
    if (!profile) return [];
    // Tasks functionality temporarily disabled due to schema mismatch
    return [];
  };

  const createDueDiligenceReport = async (reportData: any) => {
    if (!profile) throw new Error('Not authenticated');
    // Report creation temporarily disabled due to schema mismatch
    return { success: false, error: 'Feature temporarily disabled' };
  };

  const updateDueDiligenceReport = async (reportId: string, updates: Partial<DueDiligenceReport>) => {
    if (!profile) throw new Error('Not authenticated');
    // Report update temporarily disabled due to schema mismatch
    return { success: false, error: 'Feature temporarily disabled' };
  };

  const createDueDiligenceTask = async (taskData: any) => {
    if (!profile) throw new Error('Not authenticated');
    // Task creation temporarily disabled due to schema mismatch
    return { success: false, error: 'Feature temporarily disabled' };
  };

  const updateDueDiligenceTask = async (taskId: string, updates: Partial<DueDiligenceTask>) => {
    if (!profile) throw new Error('Not authenticated');
    // Task update temporarily disabled due to schema mismatch
    return { success: false, error: 'Feature temporarily disabled' };
  };

  const completeTask = async (taskId: string) => {
    if (!profile) throw new Error('Not authenticated');
    // Task completion temporarily disabled due to schema mismatch
    return { success: false, error: 'Feature temporarily disabled' };
  };

  const getListings = async () => {
    if (!profile) return [];

    try {
      const { data, error } = await supabase
        .from('voltmarket_listings')
        .select('id, title, location, power_capacity_mw, asking_price, status')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  };

  return {
    loading,
    getDueDiligenceReports,
    getDueDiligenceTasks,
    createDueDiligenceReport,
    updateDueDiligenceReport,
    createDueDiligenceTask,
    updateDueDiligenceTask,
    completeTask,
    getListings
  };
};