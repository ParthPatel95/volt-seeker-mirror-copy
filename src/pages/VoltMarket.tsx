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
import { VoltMarketAdvancedSearch } from '@/components/voltmarket/VoltMarketAdvancedSearch';
import { VoltMarketNotificationCenter } from '@/components/voltmarket/VoltMarketNotificationCenter';
import { VoltMarketQATest } from '@/components/voltmarket/VoltMarketQATest';
import { VoltMarketDocumentCenter } from '@/components/voltmarket/VoltMarketDocumentCenter';
import { VoltMarketAdvancedPortfolio } from '@/components/voltmarket/VoltMarketAdvancedPortfolio';
import { VoltMarketLOICenter } from '@/components/voltmarket/VoltMarketLOICenter';
import { VoltMarketDueDiligenceCenter } from '@/components/voltmarket/VoltMarketDueDiligenceCenter';
import { VoltMarketContactMessages } from '@/components/voltmarket/VoltMarketContactMessages';
import { VoltMarketDocumentRequests } from '@/components/voltmarket/VoltMarketDocumentRequests';
import { VoltMarketInvestmentCalculator } from '@/components/voltmarket/VoltMarketInvestmentCalculator';
import { VoltMarketMarketReports } from '@/components/voltmarket/VoltMarketMarketReports';
import { VoltMarketPrivacyPolicy } from '@/components/voltmarket/VoltMarketPrivacyPolicy';
import { VoltMarketTermsOfService } from '@/components/voltmarket/VoltMarketTermsOfService';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { VoltMarketLogin } from '@/components/voltmarket/VoltMarketLogin';
import { ComprehensiveTestSuite } from '@/components/ComprehensiveTestSuite';

export const VoltMarket = () => {
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
          <VoltMarketListings />
        </VoltMarketLayout>
      } />
      <Route path="/listings/:id" element={
        <VoltMarketLayout>
          <VoltMarketListingDetail />
        </VoltMarketLayout>
      } />
      <Route path="/search" element={
        <VoltMarketLayout>
          <VoltMarketAdvancedSearch />
        </VoltMarketLayout>
      } />
      <Route path="/dashboard" element={
        <VoltMarketLayout>
          <VoltMarketDashboard />
        </VoltMarketLayout>
      } />
      <Route path="/documents" element={
        <VoltMarketLayout>
          <VoltMarketDocumentCenter />
        </VoltMarketLayout>
      } />
      <Route path="/portfolio" element={
        <VoltMarketLayout>
          <VoltMarketAdvancedPortfolio />
        </VoltMarketLayout>
      } />
      <Route path="/loi-center" element={
        <VoltMarketLayout>
          <VoltMarketLOICenter />
        </VoltMarketLayout>
      } />
      <Route path="/due-diligence" element={
        <VoltMarketLayout>
          <VoltMarketDueDiligenceCenter />
        </VoltMarketLayout>
      } />
      <Route path="/profile" element={
        <VoltMarketLayout>
          <VoltMarketProfile />
        </VoltMarketLayout>
      } />
      <Route path="/verification" element={
        <VoltMarketLayout>
          <VoltMarketVerificationCenter />
        </VoltMarketLayout>
      } />
      <Route path="/create-listing" element={
        <VoltMarketLayout>
          <VoltMarketCreateListing />
        </VoltMarketLayout>
      } />
      <Route path="/edit-listing/:id" element={
        <VoltMarketLayout>
          <VoltMarketEditListing />
        </VoltMarketLayout>
      } />
      <Route path="/contact-messages" element={
        <VoltMarketLayout>
          <VoltMarketContactMessages />
        </VoltMarketLayout>
      } />
      <Route path="/document-requests" element={
        <VoltMarketLayout>
          <VoltMarketDocumentRequests />
        </VoltMarketLayout>
      } />
      <Route path="/notifications" element={
        <VoltMarketLayout>
          <VoltMarketNotificationCenter />
        </VoltMarketLayout>
      } />
      <Route path="/watchlist" element={
        <VoltMarketLayout>
          <VoltMarketWatchlist />
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
    </Routes>
  );
};