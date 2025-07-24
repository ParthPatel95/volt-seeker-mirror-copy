-- Create missing database functions for gamification and social features

-- Function to update user progress
CREATE OR REPLACE FUNCTION public.update_user_progress(
  p_user_id UUID,
  p_action_type TEXT,
  p_points INTEGER
) RETURNS VOID AS $$
BEGIN
  -- Insert or update user progress
  INSERT INTO public.user_progress (
    user_id,
    total_points,
    experience_points,
    current_level,
    lifetime_stats,
    last_activity_date
  )
  VALUES (
    p_user_id,
    p_points,
    p_points,
    1,
    jsonb_build_object(p_action_type, 1),
    CURRENT_DATE
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_progress.total_points + p_points,
    experience_points = user_progress.experience_points + p_points,
    current_level = GREATEST(1, FLOOR((user_progress.experience_points + p_points) / 1000.0) + 1),
    lifetime_stats = COALESCE(user_progress.lifetime_stats, '{}'::jsonb) || 
                    jsonb_build_object(p_action_type, COALESCE((user_progress.lifetime_stats->>p_action_type)::INTEGER, 0) + 1),
    last_activity_date = CURRENT_DATE,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user points
CREATE OR REPLACE FUNCTION public.increment_user_points(
  p_user_id UUID,
  p_points INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE public.user_progress 
  SET 
    total_points = total_points + p_points,
    experience_points = experience_points + p_points,
    current_level = GREATEST(1, FLOOR((experience_points + p_points) / 1000.0) + 1),
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- If no row was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_progress (
      user_id,
      total_points,
      experience_points,
      current_level
    ) VALUES (
      p_user_id,
      p_points,
      p_points,
      GREATEST(1, FLOOR(p_points / 1000.0) + 1)
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generic increment function for counters
CREATE OR REPLACE FUNCTION public.increment(
  table_name TEXT,
  row_id UUID,
  column_name TEXT
) RETURNS VOID AS $$
BEGIN
  -- This is a simplified version for the social posts counters
  IF table_name = 'social_posts' THEN
    IF column_name = 'likes_count' THEN
      UPDATE public.social_posts 
      SET likes_count = likes_count + 1, updated_at = NOW() 
      WHERE id = row_id;
    ELSIF column_name = 'comments_count' THEN
      UPDATE public.social_posts 
      SET comments_count = comments_count + 1, updated_at = NOW() 
      WHERE id = row_id;
    ELSIF column_name = 'shares_count' THEN
      UPDATE public.social_posts 
      SET shares_count = shares_count + 1, updated_at = NOW() 
      WHERE id = row_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;