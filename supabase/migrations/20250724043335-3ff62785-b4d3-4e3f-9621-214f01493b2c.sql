-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.cleanup_old_predictions()
RETURNS void AS $$
BEGIN
  -- Delete predictions older than 1 year
  DELETE FROM public.energy_price_predictions 
  WHERE created_at < now() - interval '1 year';
  
  -- Delete expired market intelligence
  DELETE FROM public.market_intelligence 
  WHERE valid_until < now();
  
  -- Delete expired investment recommendations
  DELETE FROM public.investment_recommendations 
  WHERE valid_until < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix search_path for is_voltscout_approved function
CREATE OR REPLACE FUNCTION public.is_voltscout_approved(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.voltscout_approved_users 
    WHERE voltscout_approved_users.user_id = is_voltscout_approved.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;