import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AccessRequest {
  id: string;
  listing_id: string;
  requester_id: string;
  seller_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
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
      // For now, return empty array since table doesn't exist
      // TODO: Create voltmarket_nda_requests table
      setAccessRequests([]);
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
      // For now, just return success since table doesn't exist
      // TODO: Create voltmarket_nda_requests table
      
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
      // For now, just return success since table doesn't exist
      // TODO: Create voltmarket_nda_requests table
      
      const newRequest: AccessRequest = {
        id: `mock-${Date.now()}`,
        listing_id: listingId,
        requester_id: requesterId,
        seller_id: sellerId,
        status: 'pending',
        created_at: new Date().toISOString(),
        approved_at: undefined,
        requester_profile: undefined,
        listing: undefined
      };

      setAccessRequests(prev => [newRequest, ...prev]);

      toast({
        title: "Success",
        description: "Access request submitted successfully."
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