import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AccessRequest {
  id: string;
  listing_id: string;
  requester_id: string;
  seller_id?: string; // Will be populated from listing relationship
  status: 'pending' | 'approved' | 'rejected';
  created_at: string; // mapped from requested_at
  approved_at?: string; // mapped from responded_at
  requester_profile?: {
    company_name?: string;
    role: string;
  };
  listing?: {
    title: string;
  };
}

export const useVoltMarketAccessRequests = () => {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAccessRequests = useCallback(async (sellerId: string) => {
    setLoading(true);
    try {
      // First get all requests and then filter by seller via listing relationship
      const response = await supabase
        .from('voltmarket_nda_requests')
        .select(`
          id,
          listing_id,
          requester_id,
          status,
          created_at,
          approved_at,
          voltmarket_listings!inner(seller_id)
        `)
        .eq('voltmarket_listings.seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (response.error) throw response.error;
      
      const mappedRequests: AccessRequest[] = (response.data || []).map((item: any) => ({
        id: item.id,
        listing_id: item.listing_id,
        requester_id: item.requester_id,
        seller_id: sellerId,
        status: item.status as 'pending' | 'approved' | 'rejected',
        created_at: item.created_at,
        approved_at: item.approved_at || undefined,
        requester_profile: { 
          company_name: 'Unknown Company', 
          role: 'buyer' 
        },
        listing: { title: 'Listing' }
      }));
      
      setAccessRequests(mappedRequests);
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
          approved_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', requestId);

      if (error) throw error;

      setAccessRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status, approved_at: status === 'approved' ? new Date().toISOString() : req.approved_at }
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

  const submitAccessRequest = useCallback(async (listingId: string, requesterId: string, sellerId: string) => {
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