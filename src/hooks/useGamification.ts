import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProgress {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  experience_points: number;
  streak_days: number;
  last_activity_date: string;
  lifetime_stats: any;
}

interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  points_earned: number;
  badge_icon: string;
  earned_at: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  category: string;
  score: number;
  rank_position: number;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  type: string;
}

export const useGamification = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize user progress
  const initializeProgress = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('gamification-engine', {
        body: {
          action: 'get_user_progress',
          data: { user_id: user.id }
        }
      });

      if (error) throw error;

      setProgress(data.progress);
      setAchievements(data.achievements || []);
      
      return data;
    } catch (error: any) {
      console.error('Error initializing progress:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load user progress",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user progress for actions
  const updateProgress = async (actionType: string, points: number, metadata?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('gamification-engine', {
        body: {
          action: 'update_progress',
          data: {
            user_id: user.id,
            action_type: actionType,
            points,
            metadata
          }
        }
      });

      if (error) throw error;

      setProgress(data.progress);

      // Show achievement notifications if any
      if (data.newAchievements && data.newAchievements.length > 0) {
        data.newAchievements.forEach((achievement: any) => {
          toast({
            title: "🎉 Achievement Unlocked!",
            description: `${achievement.name}: ${achievement.description}`,
            duration: 5000,
          });
        });
      }
      
      return data.progress;
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update progress",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Track daily login
  const trackDailyLogin = async () => {
    await updateProgress('daily_login', 10);
  };

  // Track property viewed
  const trackPropertyViewed = async (propertyId: string) => {
    await updateProgress('property_viewed', 2, { property_id: propertyId });
  };

  // Track listing created
  const trackListingCreated = async (listingId: string) => {
    await updateProgress('listing_created', 50, { listing_id: listingId });
  };

  // Track search performed
  const trackSearchPerformed = async (searchTerms: string) => {
    await updateProgress('search_performed', 1, { search_terms: searchTerms });
  };

  // Load leaderboard
  const loadLeaderboard = async (category = 'total_points', periodType = 'all_time', limit = 100) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('gamification-engine', {
        body: {
          action: 'get_leaderboard',
          data: {
            category,
            period_type: periodType,
            limit
          }
        }
      });

      if (error) throw error;

      setLeaderboard(data.leaderboard || []);
      return data.leaderboard;
    } catch (error: any) {
      console.error('Error loading leaderboard:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load leaderboard",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load available rewards
  const loadAvailableRewards = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('gamification-engine', {
        body: {
          action: 'get_available_rewards',
          data: {}
        }
      });

      if (error) throw error;

      setAvailableRewards(data.rewards || []);
      return data.rewards;
    } catch (error: any) {
      console.error('Error loading rewards:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load rewards",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Redeem a reward
  const redeemReward = async (reward: Reward) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('gamification-engine', {
        body: {
          action: 'redeem_reward',
          data: {
            user_id: user.id,
            reward_type: reward.type,
            reward_name: reward.name,
            points_cost: reward.points_cost
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${reward.name}`,
      });

      // Refresh user progress
      await initializeProgress();
      
      return data.redemption;
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to redeem reward",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Calculate experience to next level
  const getExperienceToNextLevel = () => {
    if (!progress) return 0;
    const nextLevelXP = progress.current_level * 1000;
    return nextLevelXP - progress.experience_points;
  };

  // Get progress percentage to next level
  const getProgressToNextLevel = () => {
    if (!progress) return 0;
    const currentLevelXP = (progress.current_level - 1) * 1000;
    const nextLevelXP = progress.current_level * 1000;
    const progressInLevel = progress.experience_points - currentLevelXP;
    const levelRange = nextLevelXP - currentLevelXP;
    return (progressInLevel / levelRange) * 100;
  };

  // Initialize on mount
  useEffect(() => {
    initializeProgress();
    loadAvailableRewards();
  }, []);

  return {
    progress,
    achievements,
    leaderboard,
    availableRewards,
    loading,
    initializeProgress,
    updateProgress,
    trackDailyLogin,
    trackPropertyViewed,
    trackListingCreated,
    trackSearchPerformed,
    loadLeaderboard,
    loadAvailableRewards,
    redeemReward,
    getExperienceToNextLevel,
    getProgressToNextLevel,
  };
};