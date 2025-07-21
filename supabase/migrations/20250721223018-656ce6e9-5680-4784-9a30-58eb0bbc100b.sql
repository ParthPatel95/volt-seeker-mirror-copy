-- Add RLS policies for tables with RLS enabled but no policies

-- voltscout_approved_users - restrict to admin access only  
CREATE POLICY "Admin can manage voltscout approved users" ON public.voltscout_approved_users
FOR ALL 
USING (false) -- No one can access by default
WITH CHECK (false);

-- linkedin_intelligence - read-only for authenticated users
CREATE POLICY "Authenticated users can view linkedin intelligence" ON public.linkedin_intelligence
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- news_intelligence - read-only for authenticated users
CREATE POLICY "Authenticated users can view news intelligence" ON public.news_intelligence
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- corporate_insights - read-only for authenticated users
CREATE POLICY "Authenticated users can view corporate insights" ON public.corporate_insights
FOR SELECT 
USING (auth.uid() IS NOT NULL);