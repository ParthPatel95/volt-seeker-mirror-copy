
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

interface Verification {
  id: string;
  user_id: string;
  verification_type: 'id_document' | 'business_license' | 'utility_bill' | 'bank_statement';
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export const useVoltMarketVerification = () => {
  const { profile } = useVoltMarketAuth();
  const [loading, setLoading] = useState(false);

  const uploadVerificationDocument = async (file: File, verificationType: string) => {
    if (!profile) throw new Error('Must be logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}/${verificationType}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const submitVerification = async (verificationType: string, file: File) => {
    if (!profile) throw new Error('Must be logged in');

    setLoading(true);
    try {
      // Verification submission temporarily disabled due to schema mismatch
      return { data: null, error: 'Feature temporarily disabled' };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getVerifications = async () => {
    if (!profile) return { data: null, error: 'Not logged in' };

    try {
      // Verification system temporarily disabled due to schema mismatch
      return { data: [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    loading,
    submitVerification,
    getVerifications
  };
};
