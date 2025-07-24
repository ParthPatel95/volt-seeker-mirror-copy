import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, data } = await req.json();

    console.log('Gamification action:', action);

    switch (action) {
      case 'get_user_progress':
        return await getUserProgress(supabase, data);
      case 'update_progress':
        return await updateProgress(supabase, data);
      case 'check_achievements':
        return await checkAchievements(supabase, data);
      case 'get_leaderboard':
        return await getLeaderboard(supabase, data);
      case 'redeem_reward':
        return await redeemReward(supabase, data);
      case 'get_available_rewards':
        return await getAvailableRewards(supabase, data);
      case 'calculate_streak':
        return await calculateStreak(supabase, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Gamification error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process gamification request'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function getUserProgress(supabase: any, data: any) {
  const { user_id } = data;

  // Get user progress
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (progressError && progressError.code !== 'PGRST116') {
    throw progressError;
  }

  // Get recent achievements
  const { data: achievements, error: achievementsError } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', user_id)
    .order('earned_at', { ascending: false })
    .limit(10);

  if (achievementsError) throw achievementsError;

  // If no progress exists, create initial progress
  if (!progress) {
    const { data: newProgress, error: createError } = await supabase
      .from('user_progress')
      .insert({
        user_id,
        total_points: 0,
        current_level: 1,
        experience_points: 0,
        streak_days: 0
      })
      .select()
      .single();

    if (createError) throw createError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        progress: newProgress, 
        achievements: achievements || [] 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, progress, achievements: achievements || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateProgress(supabase: any, data: any) {
  const { user_id, action_type, points, metadata = {} } = data;

  // Get current progress or create new
  let { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (!progress) {
    const { data: newProgress, error } = await supabase
      .from('user_progress')
      .insert({
        user_id,
        total_points: points,
        current_level: 1,
        experience_points: points,
        streak_days: action_type === 'daily_login' ? 1 : 0,
        lifetime_stats: { [action_type]: 1 }
      })
      .select()
      .single();

    if (error) throw error;
    progress = newProgress;
  } else {
    // Update existing progress
    const newTotalPoints = progress.total_points + points;
    const newExperiencePoints = progress.experience_points + points;
    const newLevel = Math.floor(newExperiencePoints / 1000) + 1; // 1000 XP per level
    
    // Update lifetime stats
    const lifetimeStats = progress.lifetime_stats || {};
    lifetimeStats[action_type] = (lifetimeStats[action_type] || 0) + 1;

    // Calculate streak for daily login
    let newStreakDays = progress.streak_days;
    if (action_type === 'daily_login') {
      const lastActivity = new Date(progress.last_activity_date);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        newStreakDays += 1;
      } else if (daysDiff > 1) {
        newStreakDays = 1;
      }
    }

    const { data: updatedProgress, error } = await supabase
      .from('user_progress')
      .update({
        total_points: newTotalPoints,
        experience_points: newExperiencePoints,
        current_level: newLevel,
        streak_days: newStreakDays,
        last_activity_date: new Date().toISOString().split('T')[0],
        lifetime_stats: lifetimeStats
      })
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) throw error;
    progress = updatedProgress;

    // Check for level up achievement
    if (newLevel > progress.current_level) {
      await createAchievement(supabase, user_id, 'level_up', `Level ${newLevel} Reached`, `Congratulations on reaching level ${newLevel}!`, 100);
    }
  }

  // Check for other achievements
  await checkAchievements(supabase, { user_id, action_type, metadata });

  // Update leaderboard
  await updateLeaderboard(supabase, user_id, progress.total_points);

  return new Response(
    JSON.stringify({ success: true, progress }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function checkAchievements(supabase: any, data: any) {
  const { user_id, action_type, metadata } = data;

  const achievements = [];

  // Get user progress for checking requirements
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (!progress) return;

  // Define achievement rules
  const achievementRules = [
    {
      type: 'first_post',
      name: 'First Post',
      description: 'Created your first social post',
      trigger: action_type === 'post_created',
      requirement: (stats: any) => (stats.post_created || 0) === 1,
      points: 50,
      icon: '📝'
    },
    {
      type: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Made 50 social interactions',
      trigger: action_type === 'social_interaction',
      requirement: (stats: any) => (stats.social_interaction || 0) >= 50,
      points: 200,
      icon: '🦋'
    },
    {
      type: 'streak_master',
      name: 'Streak Master',
      description: 'Maintained a 7-day login streak',
      trigger: action_type === 'daily_login',
      requirement: (stats: any, progress: any) => progress.streak_days >= 7,
      points: 300,
      icon: '🔥'
    },
    {
      type: 'power_user',
      name: 'Power User',
      description: 'Reached 1000 total points',
      trigger: true,
      requirement: (stats: any, progress: any) => progress.total_points >= 1000,
      points: 500,
      icon: '⚡'
    }
  ];

  // Check each achievement rule
  for (const rule of achievementRules) {
    if (!rule.trigger) continue;

    // Check if user already has this achievement
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', user_id)
      .eq('achievement_type', rule.type)
      .single();

    if (existingAchievement) continue;

    // Check if requirement is met
    if (rule.requirement(progress.lifetime_stats || {}, progress)) {
      await createAchievement(supabase, user_id, rule.type, rule.name, rule.description, rule.points, rule.icon);
      achievements.push(rule);
    }
  }

  return new Response(
    JSON.stringify({ success: true, newAchievements: achievements }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createAchievement(supabase: any, user_id: string, type: string, name: string, description: string, points: number, icon?: string) {
  const { error } = await supabase
    .from('user_achievements')
    .insert({
      user_id,
      achievement_type: type,
      achievement_name: name,
      description,
      points_earned: points,
      badge_icon: icon
    });

  if (error) {
    console.error('Failed to create achievement:', error);
  } else {
    // Update user's total points
    await supabase.rpc('increment_user_points', {
      p_user_id: user_id,
      p_points: points
    });
  }
}

async function getLeaderboard(supabase: any, data: any) {
  const { category = 'total_points', period_type = 'all_time', limit = 100 } = data;

  const { data: leaderboard, error } = await supabase
    .from('leaderboards')
    .select(`
      *,
      gridbazaar_profiles!inner(company_name, profile_image_url)
    `)
    .eq('category', category)
    .eq('period_type', period_type)
    .order('score', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, leaderboard }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateLeaderboard(supabase: any, user_id: string, score: number) {
  // Update or insert leaderboard entry
  const { error } = await supabase
    .from('leaderboards')
    .upsert({
      user_id,
      category: 'total_points',
      score,
      period_type: 'all_time'
    }, {
      onConflict: 'user_id,category,period_type'
    });

  if (error) {
    console.error('Failed to update leaderboard:', error);
  }
}

async function redeemReward(supabase: any, data: any) {
  const { user_id, reward_type, reward_name, points_cost } = data;

  // Check if user has enough points
  const { data: progress } = await supabase
    .from('user_progress')
    .select('total_points')
    .eq('user_id', user_id)
    .single();

  if (!progress || progress.total_points < points_cost) {
    throw new Error('Insufficient points for this reward');
  }

  // Create redemption record
  const { data: redemption, error } = await supabase
    .from('reward_redemptions')
    .insert({
      user_id,
      reward_type,
      reward_name,
      points_cost,
      status: 'completed'
    })
    .select()
    .single();

  if (error) throw error;

  // Deduct points from user
  await supabase
    .from('user_progress')
    .update({
      total_points: progress.total_points - points_cost
    })
    .eq('user_id', user_id);

  return new Response(
    JSON.stringify({ success: true, redemption }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getAvailableRewards(supabase: any, data: any) {
  // Static rewards for now - could be moved to database
  const rewards = [
    {
      id: 'badge_bronze',
      name: 'Bronze Badge',
      description: 'Unlock a bronze achievement badge',
      points_cost: 100,
      type: 'badge'
    },
    {
      id: 'badge_silver',
      name: 'Silver Badge',
      description: 'Unlock a silver achievement badge',
      points_cost: 250,
      type: 'badge'
    },
    {
      id: 'profile_theme',
      name: 'Custom Profile Theme',
      description: 'Unlock custom profile theme options',
      points_cost: 500,
      type: 'customization'
    },
    {
      id: 'premium_features',
      name: 'Premium Features Access',
      description: '30 days of premium features',
      points_cost: 1000,
      type: 'premium'
    }
  ];

  return new Response(
    JSON.stringify({ success: true, rewards }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function calculateStreak(supabase: any, data: any) {
  const { user_id } = data;

  const { data: progress } = await supabase
    .from('user_progress')
    .select('streak_days, last_activity_date')
    .eq('user_id', user_id)
    .single();

  if (!progress) {
    return new Response(
      JSON.stringify({ success: true, streak: 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const lastActivity = new Date(progress.last_activity_date);
  const today = new Date();
  const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  let currentStreak = progress.streak_days;
  if (daysDiff > 1) {
    currentStreak = 0; // Streak broken
  }

  return new Response(
    JSON.stringify({ success: true, streak: currentStreak }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}