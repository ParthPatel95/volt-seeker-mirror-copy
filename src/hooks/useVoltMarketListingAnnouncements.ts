import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

export const useVoltMarketListingAnnouncements = () => {
  const { profile } = useVoltMarketAuth();

  useEffect(() => {
    if (!profile) return;

    // Subscribe to new listing insertions
    const channel = supabase
      .channel('listing-announcements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'voltmarket_listings',
          filter: `seller_id=eq.${profile.id}`
        },
        async (payload) => {
          const newListing = payload.new;
          
          // Create social post for the new listing
          const postContent = `🏭 New listing available! 

${newListing.title}

📍 Location: ${newListing.location}
⚡ Power Capacity: ${newListing.power_capacity_mw ? `${newListing.power_capacity_mw} MW` : 'Contact for details'}
💰 Price: $${newListing.asking_price?.toLocaleString()}

${newListing.description ? newListing.description.substring(0, 200) + (newListing.description.length > 200 ? '...' : '') : ''}

#EnergyInfrastructure #PowerSites #RealEstate`;

          try {
            await supabase
              .from('voltmarket_social_posts')
              .insert({
                user_id: profile.id,
                content: postContent,
                post_type: 'listing_announcement',
                related_listing_id: newListing.id,
                hashtags: ['#EnergyInfrastructure', '#PowerSites', '#RealEstate'],
                visibility: 'public'
              });
            
            console.log('Listing announcement posted to social feed');
          } catch (error) {
            console.error('Error creating listing announcement:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  // Function to manually create announcement for existing listing
  const createListingAnnouncement = async (listingId: string) => {
    if (!profile) return;

    try {
      // Get listing details
      const { data: listing } = await supabase
        .from('voltmarket_listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (!listing) return;

      const postContent = `🏭 Check out this listing! 

${listing.title}

📍 Location: ${listing.location}
⚡ Power Capacity: ${listing.power_capacity_mw ? `${listing.power_capacity_mw} MW` : 'Contact for details'}
💰 Price: $${listing.asking_price?.toLocaleString()}

${listing.description ? listing.description.substring(0, 200) + (listing.description.length > 200 ? '...' : '') : ''}

#EnergyInfrastructure #PowerSites #RealEstate`;

      await supabase
        .from('voltmarket_social_posts')
        .insert({
          user_id: profile.id,
          content: postContent,
          post_type: 'listing_announcement',
          related_listing_id: listing.id,
          hashtags: ['#EnergyInfrastructure', '#PowerSites', '#RealEstate'],
          visibility: 'public'
        });

      return true;
    } catch (error) {
      console.error('Error creating listing announcement:', error);
      return false;
    }
  };

  return {
    createListingAnnouncement
  };
};