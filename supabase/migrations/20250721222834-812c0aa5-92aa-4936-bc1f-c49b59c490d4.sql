-- Fix Function Search Path Mutable warnings by setting search_path

-- Update the update_gridbazaar_profiles_updated_at function with secure search_path
CREATE OR REPLACE FUNCTION public.update_gridbazaar_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update the is_voltscout_approved function with secure search_path
CREATE OR REPLACE FUNCTION public.is_voltscout_approved(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE 
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.voltscout_approved_users 
    WHERE voltscout_approved_users.user_id = is_voltscout_approved.user_id
  );
END;
$function$;

-- Update the update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update the handle_new_user function with secure search_path  
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$function$;