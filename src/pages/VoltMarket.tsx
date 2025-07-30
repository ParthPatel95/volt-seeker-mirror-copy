import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VoltMarketLayout } from '@/components/voltmarket/VoltMarketLayout';
import { VoltMarketHomepage } from '@/components/voltmarket/VoltMarketHomepage';
import { WattbytesAuth } from '@/components/voltmarket/WattbytesAuth';
import { VoltMarketListings } from '@/components/voltmarket/VoltMarketListings';
import { VoltMarketDashboard } from '@/components/voltmarket/VoltMarketDashboard';
import { VoltMarketProfile } from '@/components/voltmarket/VoltMarketProfile';
import { VoltMarketCreateListing } from '@/components/voltmarket/VoltMarketCreateListing';
import { VoltMarketEditListing } from '@/components/voltmarket/VoltMarketEditListing';
import { VoltMarketListingDetail } from '@/components/voltmarket/VoltMarketListingDetail';
import { VoltMarketMessages } from '@/components/voltmarket/VoltMarketMessages';
import { VoltMarketEnhancedMessages } from '@/components/voltmarket/VoltMarketEnhancedMessages';
import { VoltMarketWatchlist } from '@/components/voltmarket/VoltMarketWatchlist';
import { VoltMarketVerificationCenter } from '@/components/voltmarket/VoltMarketVerificationCenter';

import { VoltMarketUnifiedListings } from '@/components/voltmarket/VoltMarketUnifiedListings';
import { VoltMarketAdvancedSearch } from '@/components/voltmarket/VoltMarketAdvancedSearch';
import { VoltMarketNotificationCenter } from '@/components/voltmarket/VoltMarketNotificationCenter';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { VoltMarketQATest } from '@/components/voltmarket/VoltMarketQATest';
import { VoltMarketDocumentCenter } from '@/components/voltmarket/VoltMarketDocumentCenter';
import { VoltMarketAdvancedPortfolio } from '@/components/voltmarket/VoltMarketAdvancedPortfolio';
import { VoltMarketLOICenter } from '@/components/voltmarket/VoltMarketLOICenter';
import { VoltMarketDueDiligenceCenter } from '@/components/voltmarket/VoltMarketDueDiligenceCenter';
import { VoltMarketContactMessages } from '@/components/voltmarket/VoltMarketContactMessages';
import { VoltMarketDocumentRequests } from '@/components/voltmarket/VoltMarketDocumentRequests';
import { SocialPage } from '@/components/voltmarket/social/SocialPage';
import { CompanyProfile } from '@/components/voltmarket/social/CompanyProfile';
import { AdvancedFinancialIntelligenceHub } from '@/components/financial-intelligence/AdvancedFinancialIntelligenceHub';
import { EnhancedSocialHub } from '@/components/social/EnhancedSocialHub';
import { GamificationDashboard } from '@/components/gamification/GamificationDashboard';
import { ComprehensiveFeatureTest } from '@/components/testing/ComprehensiveFeatureTest';
import { AIIntelligenceHub } from '@/components/ai-intelligence/AIIntelligenceHub';
import { SocialFeaturesTest } from '@/components/voltmarket/social/SocialFeaturesTest';
import { SocialNetworkTest } from '@/components/social/SocialNetworkTest';
import { VoltMarketInvestmentCalculator } from '@/components/voltmarket/VoltMarketInvestmentCalculator';
import { VoltMarketMarketReports } from '@/components/voltmarket/VoltMarketMarketReports';
import { VoltMarketPrivacyPolicy } from '@/components/voltmarket/VoltMarketPrivacyPolicy';
import { VoltMarketTermsOfService } from '@/components/voltmarket/VoltMarketTermsOfService';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { VoltMarketLogin } from '@/components/voltmarket/VoltMarketLogin';
import { ComprehensiveTestSuite } from '@/components/ComprehensiveTestSuite';

export const VoltMarket = () => {
  const { user, loading } = useVoltMarketAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <VoltMarketLayout>
          <VoltMarketHomepage />
        </VoltMarketLayout>
      } />
      <Route path="/home" element={
        <VoltMarketLayout>
          <VoltMarketHomepage />
        </VoltMarketLayout>
      } />
      <Route path="/auth" element={<WattbytesAuth />} />
      <Route path="/login" element={<VoltMarketLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/listings" element={
        <VoltMarketLayout>
          <VoltMarketUnifiedListings />
        </VoltMarketLayout>
      } />
      <Route path="/listings/:id" element={
        <VoltMarketLayout>
          <VoltMarketListingDetail />
        </VoltMarketLayout>
      } />
      <Route path="/search" element={
        <VoltMarketLayout>
          <VoltMarketUnifiedListings />
        </VoltMarketLayout>
      } />
      <Route path="/dashboard" element={
        <VoltMarketLayout>
          {user ? <VoltMarketDashboard /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/documents" element={
        <VoltMarketLayout>
          {user ? <VoltMarketDocumentCenter /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/portfolio" element={
        <VoltMarketLayout>
          {user ? <VoltMarketAdvancedPortfolio /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/loi-center" element={
        <VoltMarketLayout>
          {user ? <VoltMarketLOICenter /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/due-diligence" element={
        <VoltMarketLayout>
          {user ? <VoltMarketDueDiligenceCenter /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/profile" element={
        <VoltMarketLayout>
          {user && !loading ? <VoltMarketProfile /> : (!loading ? <WattbytesAuth /> : <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>)}
        </VoltMarketLayout>
      } />
      <Route path="/verification" element={
        <VoltMarketLayout>
          {user && !loading ? <VoltMarketVerificationCenter /> : (!loading ? <WattbytesAuth /> : <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>)}
        </VoltMarketLayout>
      } />
      <Route path="/create-listing" element={
        <VoltMarketLayout>
          {user ? <VoltMarketCreateListing /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/edit-listing/:id" element={
        <VoltMarketLayout>
          {user ? <VoltMarketEditListing /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/contact-messages" element={
        <VoltMarketLayout>
          {user ? <VoltMarketContactMessages /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/document-requests" element={
        <VoltMarketLayout>
          {user ? <VoltMarketDocumentRequests /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/notifications" element={
        <VoltMarketLayout>
          {user ? <VoltMarketNotificationCenter /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/watchlist" element={
        <VoltMarketLayout>
          {user ? <VoltMarketWatchlist /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/company/:companyId" element={
        <VoltMarketLayout>
          <CompanyProfile />
        </VoltMarketLayout>
      } />
      <Route path="/social-test" element={
        <VoltMarketLayout>
          <SocialFeaturesTest />
        </VoltMarketLayout>
      } />
      <Route path="/social-network-test" element={
        <VoltMarketLayout>
          <SocialNetworkTest />
        </VoltMarketLayout>
      } />
      <Route path="/calculator" element={
        <VoltMarketLayout>
          <VoltMarketInvestmentCalculator />
        </VoltMarketLayout>
      } />
      <Route path="/reports" element={
        <VoltMarketLayout>
          <VoltMarketMarketReports />
        </VoltMarketLayout>
      } />
      <Route path="/qa-test" element={
        <VoltMarketLayout>
          <VoltMarketQATest />
        </VoltMarketLayout>
      } />
      <Route path="/comprehensive-test" element={
        <VoltMarketLayout>
          <ComprehensiveTestSuite />
        </VoltMarketLayout>
      } />
      <Route path="/privacy-policy" element={
        <VoltMarketLayout>
          <VoltMarketPrivacyPolicy />
        </VoltMarketLayout>
      } />
      <Route path="/terms-of-service" element={
        <VoltMarketLayout>
          <VoltMarketTermsOfService />
        </VoltMarketLayout>
      } />
      <Route path="/ai-intelligence" element={
        <VoltMarketLayout>
          {user ? <AIIntelligenceHub /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
      <Route path="/financial-intelligence" element={
        <VoltMarketLayout>
          {user ? <AdvancedFinancialIntelligenceHub /> : <WattbytesAuth />}
        </VoltMarketLayout>
      } />
        
        {/* Social & Collaboration */}
        <Route path="/social-hub" element={
          <VoltMarketLayout>
            {user ? <SocialNetworkTest /> : <WattbytesAuth />}
          </VoltMarketLayout>
        } />
        
        {/* Gamification */}
        <Route path="/achievements" element={
          <VoltMarketLayout>
            {user ? <GamificationDashboard /> : <WattbytesAuth />}
          </VoltMarketLayout>
        } />
        
        {/* Feature Testing */}
        <Route path="/feature-test" element={
          <VoltMarketLayout>
            {user ? <ComprehensiveFeatureTest /> : <WattbytesAuth />}
          </VoltMarketLayout>
        } />
    </Routes>
  );
};
