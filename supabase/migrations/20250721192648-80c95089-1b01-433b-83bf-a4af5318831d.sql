-- Create comprehensive RLS policies for all tables

-- Profiles policies
CREATE POLICY "Authenticated users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- GridBazaar profiles policies  
CREATE POLICY "Users can view their own gridbazaar profile" ON public.gridbazaar_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own gridbazaar profile" ON public.gridbazaar_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own gridbazaar profile" ON public.gridbazaar_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own gridbazaar profile" ON public.gridbazaar_profiles FOR DELETE USING (auth.uid() = user_id);

-- VoltMarket profiles policies
CREATE POLICY "Users can view their own voltmarket profile" ON public.voltmarket_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own voltmarket profile" ON public.voltmarket_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own voltmarket profile" ON public.voltmarket_profiles FOR UPDATE USING (auth.uid() = user_id);

-- VoltMarket listings policies
CREATE POLICY "Anyone can view active listings" ON public.voltmarket_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create listings" ON public.voltmarket_listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings" ON public.voltmarket_listings FOR UPDATE USING (auth.uid() = seller_id);

-- VoltMarket listing images policies
CREATE POLICY "Anyone can view listing images" ON public.voltmarket_listing_images FOR SELECT USING (true);
CREATE POLICY "Listing owners can manage images" ON public.voltmarket_listing_images FOR ALL USING (auth.uid() IN (SELECT seller_id FROM voltmarket_listings WHERE id = listing_id));

-- VoltMarket conversations policies
CREATE POLICY "Users can view conversations they're in" ON public.voltmarket_conversations FOR ALL USING (auth.uid() = ANY(participant_ids));

-- VoltMarket messages policies  
CREATE POLICY "Users can view messages they're involved in" ON public.voltmarket_messages FOR ALL USING ((auth.uid() = sender_id) OR (auth.uid() = recipient_id));

-- VoltMarket contact messages policies
CREATE POLICY "Users can manage voltmarket contact messages" ON public.voltmarket_contact_messages FOR ALL USING (auth.uid() = listing_owner_id);

-- VoltMarket LOIs policies
CREATE POLICY "Users can view LOIs they're involved in" ON public.voltmarket_lois FOR SELECT USING ((auth.uid() = buyer_id) OR (auth.uid() = seller_id));
CREATE POLICY "Buyers can create LOIs" ON public.voltmarket_lois FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update LOI status" ON public.voltmarket_lois FOR UPDATE USING (auth.uid() = seller_id);

-- VoltMarket documents policies
CREATE POLICY "Users can view their own documents" ON public.voltmarket_documents FOR SELECT USING (auth.uid() = uploader_id);
CREATE POLICY "Users can create documents" ON public.voltmarket_documents FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Users can update their documents" ON public.voltmarket_documents FOR UPDATE USING (auth.uid() = uploader_id);
CREATE POLICY "Users can delete their documents" ON public.voltmarket_documents FOR DELETE USING (auth.uid() = uploader_id);

-- VoltMarket due diligence policies
CREATE POLICY "Users can view due diligence they're involved in" ON public.voltmarket_due_diligence FOR ALL USING ((auth.uid() = buyer_id) OR (auth.uid() IN (SELECT seller_id FROM voltmarket_listings WHERE id = listing_id)));

-- VoltMarket analytics policies
CREATE POLICY "Users can view their analytics" ON public.voltmarket_analytics FOR ALL USING (auth.uid() = user_id);

-- VoltMarket NDA requests policies
CREATE POLICY "Users can manage their requests" ON public.voltmarket_nda_requests FOR ALL USING (auth.uid() = requester_id);

-- Access requests policies
CREATE POLICY "Public can create access requests" ON public.access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view access requests" ON public.access_requests FOR SELECT USING (true);

-- Site access requests policies
CREATE POLICY "Public can create site access requests" ON public.site_access_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view site access requests" ON public.site_access_requests FOR SELECT USING (true);

-- Properties policies
CREATE POLICY "Users can view all properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Users can create properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own properties" ON public.properties FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own properties" ON public.properties FOR DELETE USING (auth.uid() = created_by);

-- Scraped properties policies
CREATE POLICY "Users can view all scraped properties" ON public.scraped_properties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create scraped properties" ON public.scraped_properties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Verified heavy power sites policies
CREATE POLICY "Authenticated users can view verified sites" ON public.verified_heavy_power_sites FOR SELECT USING ((auth.uid() IS NOT NULL) AND (deleted_at IS NULL));
CREATE POLICY "Users can manage their verified sites" ON public.verified_heavy_power_sites FOR ALL USING (auth.uid() = created_by);

-- Site scan sessions policies
CREATE POLICY "Users can manage their scan sessions" ON public.site_scan_sessions FOR ALL USING (auth.uid() = created_by);

-- City power analysis policies
CREATE POLICY "Authenticated users can create city power analysis" ON public.city_power_analysis FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view all city power analysis" ON public.city_power_analysis FOR SELECT USING (true);

-- Industry intel results policies
CREATE POLICY "Authenticated users can view intel results" ON public.industry_intel_results FOR SELECT USING (auth.uid() IS NOT NULL);

-- Substations policies
CREATE POLICY "Authenticated users can create substations" ON public.substations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view all substations" ON public.substations FOR SELECT USING (true);

-- Energy markets policies
CREATE POLICY "Anyone can view energy markets" ON public.energy_markets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create energy market data" ON public.energy_markets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Energy rates policies
CREATE POLICY "Anyone can view energy rates" ON public.energy_rates FOR SELECT USING (true);

-- AI company analysis policies
CREATE POLICY "Authenticated users can view AI analysis" ON public.ai_company_analysis FOR SELECT USING (auth.uid() IS NOT NULL);

-- Distress alerts policies
CREATE POLICY "Authenticated users can view distress alerts" ON public.distress_alerts FOR SELECT USING (auth.uid() IS NOT NULL);

-- Industry intelligence policies
CREATE POLICY "Authenticated users can view industry intelligence" ON public.industry_intelligence FOR SELECT USING (auth.uid() IS NOT NULL);

-- Company real estate assets policies
CREATE POLICY "Authenticated users can view company assets" ON public.company_real_estate_assets FOR SELECT USING (auth.uid() IS NOT NULL);

-- Companies policies
CREATE POLICY "Users can view all companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create companies" ON public.companies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Alerts policies
CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts FOR DELETE USING (auth.uid() = user_id);

-- User alert preferences policies
CREATE POLICY "Users can manage their alert preferences" ON public.user_alert_preferences FOR ALL USING (auth.uid() = user_id);

-- BTC ROI calculations policies
CREATE POLICY "Users can manage their BTC calculations" ON public.btc_roi_calculations FOR ALL USING (auth.uid() = user_id);

-- Volt scores policies
CREATE POLICY "Authenticated users can create volt scores" ON public.volt_scores FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view all volt scores" ON public.volt_scores FOR SELECT USING (true);