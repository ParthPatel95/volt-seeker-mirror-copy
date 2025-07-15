-- Function to update VoltMarket updated_at column
CREATE OR REPLACE FUNCTION public.update_voltmarket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update GridBazaar profiles updated_at
CREATE OR REPLACE FUNCTION public.update_gridbazaar_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update industry intel results updated_at
CREATE OR REPLACE FUNCTION public.update_industry_intel_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to set message conversation ID
CREATE OR REPLACE FUNCTION public.set_message_conversation_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Find or create conversation
  SELECT id INTO NEW.conversation_id
  FROM public.voltmarket_conversations
  WHERE listing_id = NEW.listing_id
    AND (
      (buyer_id = NEW.sender_id AND seller_id = NEW.recipient_id) OR
      (buyer_id = NEW.recipient_id AND seller_id = NEW.sender_id)
    );
  
  -- If no conversation exists, create one
  IF NEW.conversation_id IS NULL THEN
    INSERT INTO public.voltmarket_conversations (listing_id, buyer_id, seller_id)
    VALUES (NEW.listing_id, NEW.sender_id, NEW.recipient_id)
    RETURNING id INTO NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is VoltScout approved
CREATE OR REPLACE FUNCTION public.is_voltscout_approved(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.voltscout_approved_users 
    WHERE voltscout_approved_users.user_id = is_voltscout_approved.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to soft delete verified sites
CREATE OR REPLACE FUNCTION public.soft_delete_verified_site(site_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.verified_heavy_power_sites 
  SET deleted_at = now(), updated_at = now()
  WHERE id = site_id AND created_by = auth.uid() AND deleted_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore verified sites
CREATE OR REPLACE FUNCTION public.restore_verified_site(site_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.verified_heavy_power_sites 
  SET deleted_at = NULL, updated_at = now()
  WHERE id = site_id AND created_by = auth.uid() AND deleted_at IS NOT NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to bulk delete verified sites
CREATE OR REPLACE FUNCTION public.bulk_delete_verified_sites(site_ids UUID[])
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE public.verified_heavy_power_sites 
  SET deleted_at = now(), updated_at = now()
  WHERE id = ANY(site_ids) AND created_by = auth.uid() AND deleted_at IS NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean expired verification tokens
CREATE OR REPLACE FUNCTION public.clean_expired_verification_tokens()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.voltmarket_email_verification_tokens 
  WHERE expires_at < now() AND used_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at columns
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scraped_properties_updated_at
  BEFORE UPDATE ON public.scraped_properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brokers_updated_at
  BEFORE UPDATE ON public.brokers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scraping_sources_updated_at
  BEFORE UPDATE ON public.scraping_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_energy_markets_updated_at
  BEFORE UPDATE ON public.energy_markets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_utility_companies_updated_at
  BEFORE UPDATE ON public.utility_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_utility_tariffs_updated_at
  BEFORE UPDATE ON public.utility_tariffs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_substations_updated_at
  BEFORE UPDATE ON public.substations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_city_power_analysis_updated_at
  BEFORE UPDATE ON public.city_power_analysis
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_power_demand_forecasts_updated_at
  BEFORE UPDATE ON public.power_demand_forecasts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_due_diligence_reports_updated_at
  BEFORE UPDATE ON public.due_diligence_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_real_estate_assets_updated_at
  BEFORE UPDATE ON public.company_real_estate_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_verified_heavy_power_sites_updated_at
  BEFORE UPDATE ON public.verified_heavy_power_sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industry_intel_results_updated_at
  BEFORE UPDATE ON public.industry_intel_results
  FOR EACH ROW EXECUTE FUNCTION public.update_industry_intel_results_updated_at();

CREATE TRIGGER update_btc_roi_calculations_updated_at
  BEFORE UPDATE ON public.btc_roi_calculations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VoltMarket triggers
CREATE TRIGGER update_voltmarket_profiles_updated_at
  BEFORE UPDATE ON public.voltmarket_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

CREATE TRIGGER update_voltmarket_listings_updated_at
  BEFORE UPDATE ON public.voltmarket_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

CREATE TRIGGER update_voltmarket_conversations_updated_at
  BEFORE UPDATE ON public.voltmarket_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

CREATE TRIGGER update_voltmarket_lois_updated_at
  BEFORE UPDATE ON public.voltmarket_lois
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

CREATE TRIGGER update_voltmarket_transactions_updated_at
  BEFORE UPDATE ON public.voltmarket_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

CREATE TRIGGER update_voltmarket_email_templates_updated_at
  BEFORE UPDATE ON public.voltmarket_email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

CREATE TRIGGER update_voltmarket_portfolios_updated_at
  BEFORE UPDATE ON public.voltmarket_portfolios
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

CREATE TRIGGER update_voltmarket_contact_messages_updated_at
  BEFORE UPDATE ON public.voltmarket_contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_voltmarket_updated_at();

-- GridBazaar triggers
CREATE TRIGGER update_gridbazaar_profiles_updated_at
  BEFORE UPDATE ON public.gridbazaar_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_gridbazaar_profiles_updated_at();

-- Message conversation trigger
CREATE TRIGGER set_message_conversation_id_trigger
  BEFORE INSERT ON public.voltmarket_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_message_conversation_id();

-- Storage policies for documents bucket
CREATE POLICY "Anyone can view documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.uid() IS NOT NULL
);

-- Storage policies for listing images
CREATE POLICY "Anyone can view listing images" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'listing-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete listing images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'listing-images' AND 
  auth.uid() IS NOT NULL
);

-- Storage policies for profile images
CREATE POLICY "Anyone can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' AND 
  auth.uid() IS NOT NULL
);