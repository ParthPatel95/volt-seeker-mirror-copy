import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AccessRequest {
  id: string;
  listing_id: string;
  requester_id: string;
  status: string;
  requested_at: string;
  responded_at: string | null;
}

export const useVoltMarketAccessRequests = () => {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAccessRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('voltmarket_nda_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setAccessRequests(data || []);
    } catch (error) {
      console.error('Error fetching access requests:', error);
      toast({
        title: "Error",
        description: "Failed to load access requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateAccessRequestStatus = useCallback(async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('voltmarket_nda_requests')
        .update({ 
          status,
          responded_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', requestId);

      if (error) throw error;

      setAccessRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status }
            : req
        )
      );

      toast({
        title: "Success",
        description: `Access request ${status} successfully.`
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating access request:', error);
      toast({
        title: "Error",
        description: "Failed to update access request.",
        variant: "destructive"
      });
      return { success: false };
    }
  }, [toast]);

  const submitAccessRequest = useCallback(async (listingId: string, requesterId: string) => {
    try {
      const { error } = await supabase
        .from('voltmarket_nda_requests')
        .insert({
          listing_id: listingId,
          requester_id: requesterId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your access request has been submitted to the listing owner."
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting access request:', error);
      toast({
        title: "Error",
        description: "Failed to submit access request.",
        variant: "destructive"
      });
      return { success: false };
    }
  }, [toast]);

  return {
    accessRequests,
    loading,
    fetchAccessRequests,
    updateAccessRequestStatus,
    submitAccessRequest
  };
};