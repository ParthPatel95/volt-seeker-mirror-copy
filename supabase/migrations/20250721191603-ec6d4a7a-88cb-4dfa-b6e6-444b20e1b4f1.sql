-- Create comprehensive RLS policies for all tables

-- Profiles policies
CREATE POLICY "Authenticated users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- GridBazaar profiles policies
CREATE POLICY "Users can view their own profile" ON public.gridbazaar_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.gridbazaar_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.gridbazaar_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON public.gridbazaar_profiles FOR DELETE USING (auth.uid() = user_id);

-- VoltScout approved users policies
CREATE POLICY "Authenticated users can manage voltscout approvals" ON public.voltscout_approved_users FOR ALL USING (auth.uid() IS NOT NULL);

-- Access requests policies
CREATE POLICY "Anyone can submit access requests" ON public.access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view access requests" ON public.access_requests FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only admins can update access requests" ON public.access_requests FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Site access requests policies
CREATE POLICY "Anyone can submit site access requests" ON public.site_access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view site access requests" ON public.site_access_requests FOR SELECT USING (auth.uid() IS NOT NULL);

-- Properties policies
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can view all properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update properties" ON public.properties FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete properties" ON public.properties FOR DELETE USING (auth.uid() IS NOT NULL);

-- Scraped properties policies
CREATE POLICY "Anyone can view scraped properties" ON public.scraped_properties FOR SELECT USING (true);
CREATE POLICY "Users can view scraped properties" ON public.scraped_properties FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert scraped properties" ON public.scraped_properties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert scraped properties" ON public.scraped_properties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update scraped properties" ON public.scraped_properties FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update scraped properties" ON public.scraped_properties FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete scraped properties" ON public.scraped_properties FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete scraped properties" ON public.scraped_properties FOR DELETE USING (auth.uid() IS NOT NULL);

-- VoltMarket policies
CREATE POLICY "Users can view their own voltmarket profile" ON public.voltmarket_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own voltmarket profile" ON public.voltmarket_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own voltmarket profile" ON public.voltmarket_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active listings" ON public.voltmarket_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create listings" ON public.voltmarket_listings FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id = seller_id));
CREATE POLICY "Sellers can update own listings" ON public.voltmarket_listings FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id = seller_id));

CREATE POLICY "Anyone can view listing images" ON public.voltmarket_listing_images FOR SELECT USING (true);
CREATE POLICY "Listing owners can manage images" ON public.voltmarket_listing_images FOR ALL USING (auth.uid() IN (SELECT vp.user_id FROM voltmarket_profiles vp JOIN voltmarket_listings vl ON vl.seller_id = vp.id WHERE vl.id = listing_id));

CREATE POLICY "Users can manage own watchlist" ON public.voltmarket_watchlist FOR ALL USING (auth.uid() IN (SELECT voltmarket_profiles.user_id FROM voltmarket_profiles WHERE voltmarket_profiles.id = voltmarket_watchlist.user_id));

CREATE POLICY "Conversation participants can view conversations" ON public.voltmarket_conversations FOR SELECT USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id IN (buyer_id, seller_id)));
CREATE POLICY "Users can create conversations" ON public.voltmarket_conversations FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id IN (buyer_id, seller_id)));

CREATE POLICY "Message participants can view messages" ON public.voltmarket_messages FOR SELECT USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id IN (sender_id, recipient_id)));
CREATE POLICY "Users can send messages" ON public.voltmarket_messages FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id = sender_id));
CREATE POLICY "Recipients can update message read status" ON public.voltmarket_messages FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id = recipient_id));

CREATE POLICY "Listing owners can view messages for their listings" ON public.voltmarket_contact_messages FOR SELECT USING (listing_owner_id IN (SELECT id FROM voltmarket_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Listing owners can update message read status" ON public.voltmarket_contact_messages FOR UPDATE USING (listing_owner_id IN (SELECT id FROM voltmarket_profiles WHERE user_id = auth.uid()));

CREATE POLICY "LOI participants can view LOIs" ON public.voltmarket_lois FOR SELECT USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id IN (buyer_id, seller_id)));
CREATE POLICY "Buyers can create LOIs" ON public.voltmarket_lois FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id = buyer_id));
CREATE POLICY "LOI participants can update LOIs" ON public.voltmarket_lois FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id IN (buyer_id, seller_id)));

CREATE POLICY "Users can view documents" ON public.voltmarket_documents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can upload documents" ON public.voltmarket_documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can view due diligence documents" ON public.voltmarket_due_diligence_documents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Listing owners can manage due diligence documents" ON public.voltmarket_due_diligence_documents FOR ALL USING (auth.uid() IN (SELECT vp.user_id FROM voltmarket_profiles vp JOIN voltmarket_listings vl ON vl.seller_id = vp.id WHERE vl.id = listing_id));

CREATE POLICY "Transaction participants can view transactions" ON public.voltmarket_transactions FOR SELECT USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id IN (buyer_id, seller_id)));
CREATE POLICY "Transaction participants can update transactions" ON public.voltmarket_transactions FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM voltmarket_profiles WHERE id IN (buyer_id, seller_id)));

CREATE POLICY "Authenticated users can view analytics" ON public.voltmarket_analytics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert analytics" ON public.voltmarket_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage own verifications" ON public.voltmarket_verifications FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "System can manage verification tokens" ON public.voltmarket_email_verification_tokens FOR ALL USING (true);

-- Company and intelligence policies
CREATE POLICY "Authenticated users can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update companies" ON public.companies FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can view AI analysis" ON public.ai_company_analysis FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert AI analysis" ON public.ai_company_analysis FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to real estate assets" ON public.company_real_estate_assets FOR SELECT USING (true);

CREATE POLICY "Authenticated users can view distress alerts" ON public.distress_alerts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert distress alerts" ON public.distress_alerts FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view industry intelligence" ON public.industry_intelligence FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert industry intelligence" ON public.industry_intelligence FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own intel results" ON public.industry_intel_results FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can create their own intel results" ON public.industry_intel_results FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own intel results" ON public.industry_intel_results FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own intel results" ON public.industry_intel_results FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can view linkedin intelligence" ON public.linkedin_intelligence FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert linkedin intelligence" ON public.linkedin_intelligence FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view news intelligence" ON public.news_intelligence FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert news intelligence" ON public.news_intelligence FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view corporate insights" ON public.corporate_insights FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert corporate insights" ON public.corporate_insights FOR INSERT WITH CHECK (true);

-- Financial analysis policies
CREATE POLICY "Anyone can view investment scores" ON public.investment_scores FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert investment scores" ON public.investment_scores FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update investment scores" ON public.investment_scores FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view market timing analysis" ON public.market_timing_analysis FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert market timing analysis" ON public.market_timing_analysis FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update market timing analysis" ON public.market_timing_analysis FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view competitor analysis" ON public.competitor_analysis FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert competitor analysis" ON public.competitor_analysis FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update competitor analysis" ON public.competitor_analysis FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view ESG scores" ON public.esg_scores FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert ESG scores" ON public.esg_scores FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update ESG scores" ON public.esg_scores FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view power demand forecasts" ON public.power_demand_forecasts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert power demand forecasts" ON public.power_demand_forecasts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update power demand forecasts" ON public.power_demand_forecasts FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Energy infrastructure policies
CREATE POLICY "Energy markets are publicly readable" ON public.energy_markets FOR SELECT USING (true);
CREATE POLICY "Energy rates are publicly readable" ON public.energy_rates FOR SELECT USING (true);

CREATE POLICY "City power analysis is publicly readable" ON public.city_power_analysis FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify city power analysis" ON public.city_power_analysis FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Substations are publicly readable" ON public.substations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage substations" ON public.substations FOR ALL USING (auth.uid() IS NOT NULL);

-- User-specific policies
CREATE POLICY "Users can view own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own searches" ON public.search_criteria FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own alert preferences" ON public.user_alert_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alert preferences" ON public.user_alert_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alert preferences" ON public.user_alert_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alert preferences" ON public.user_alert_preferences FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own portfolio recommendations" ON public.portfolio_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own portfolio recommendations" ON public.portfolio_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own portfolio recommendations" ON public.portfolio_recommendations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own portfolio recommendations" ON public.portfolio_recommendations FOR DELETE USING (auth.uid() = user_id);

-- Property-related policies
CREATE POLICY "Authenticated users can manage brokers" ON public.brokers FOR ALL USING (true);
CREATE POLICY "Authenticated users can manage property_brokers" ON public.property_brokers FOR ALL USING (true);
CREATE POLICY "Users can manage property notes" ON public.property_notes FOR ALL USING (true);

-- Scraping system policies
CREATE POLICY "Authenticated users can view scraping sources" ON public.scraping_sources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage scraping sources" ON public.scraping_sources FOR ALL USING (true);

CREATE POLICY "Authenticated users can view scraping jobs" ON public.scraping_jobs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage scraping jobs" ON public.scraping_jobs FOR ALL USING (true);

-- BTC ROI policies
CREATE POLICY "Users can view their own calculations" ON public.btc_roi_calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own calculations" ON public.btc_roi_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own calculations" ON public.btc_roi_calculations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own calculations" ON public.btc_roi_calculations FOR DELETE USING (auth.uid() = user_id);

-- Energy cost policies
CREATE POLICY "Users can view energy cost calculations" ON public.energy_cost_calculations FOR SELECT USING (true);
CREATE POLICY "Users can create energy cost calculations" ON public.energy_cost_calculations FOR INSERT WITH CHECK (true);

-- Crypto cache policies
CREATE POLICY "Crypto details cache is publicly readable" ON public.crypto_details_cache FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage crypto cache" ON public.crypto_details_cache FOR ALL USING (auth.uid() IS NOT NULL);

-- Due diligence policies
CREATE POLICY "Users can view their own due diligence reports" ON public.due_diligence_reports FOR SELECT USING (auth.uid() = generated_by);
CREATE POLICY "Users can create their own due diligence reports" ON public.due_diligence_reports FOR INSERT WITH CHECK (auth.uid() = generated_by);
CREATE POLICY "Users can update their own due diligence reports" ON public.due_diligence_reports FOR UPDATE USING (auth.uid() = generated_by);
CREATE POLICY "Users can delete their own due diligence reports" ON public.due_diligence_reports FOR DELETE USING (auth.uid() = generated_by);

-- Verified sites policies
CREATE POLICY "Users can view their own verified sites" ON public.verified_heavy_power_sites FOR SELECT USING (auth.uid() = created_by AND deleted_at IS NULL);
CREATE POLICY "Users can create their own verified sites" ON public.verified_heavy_power_sites FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own verified sites" ON public.verified_heavy_power_sites FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can manage their own verified sites" ON public.verified_heavy_power_sites FOR ALL USING (auth.uid() = created_by);

-- Storage policies
CREATE POLICY "Anyone can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view listing images" ON storage.objects FOR SELECT USING (bucket_id = 'listing-images');
CREATE POLICY "Authenticated users can upload listing images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete listing images" ON storage.objects FOR DELETE USING (bucket_id = 'listing-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view profile images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Authenticated users can upload profile images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete profile images" ON storage.objects FOR DELETE USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_companies_industry ON public.companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_financial_health ON public.companies(financial_health_score);
CREATE INDEX IF NOT EXISTS idx_companies_analyzed_at ON public.companies(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_distress_alerts_company ON public.distress_alerts(company_name);
CREATE INDEX IF NOT EXISTS idx_distress_alerts_level ON public.distress_alerts(distress_level);
CREATE INDEX IF NOT EXISTS idx_distress_alerts_created ON public.distress_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_city_state ON public.scraped_properties(city, state);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_property_type ON public.scraped_properties(property_type);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_scraped_at ON public.scraped_properties(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_source ON public.scraped_properties(source);
CREATE INDEX IF NOT EXISTS idx_company_real_estate_assets_company_name ON public.company_real_estate_assets(company_name);
CREATE INDEX IF NOT EXISTS idx_company_real_estate_assets_ticker ON public.company_real_estate_assets(company_ticker);
CREATE INDEX IF NOT EXISTS idx_company_real_estate_assets_property_type ON public.company_real_estate_assets(property_type);
CREATE INDEX IF NOT EXISTS idx_crypto_details_cache_symbol ON public.crypto_details_cache(symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_details_cache_updated ON public.crypto_details_cache(last_updated);

-- Enable realtime for key tables
ALTER TABLE public.voltmarket_messages REPLICA IDENTITY FULL;
ALTER TABLE public.voltmarket_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.voltmarket_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.due_diligence_reports REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.voltmarket_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voltmarket_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voltmarket_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.due_diligence_reports;