import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GridBazaarLayout } from '@/components/gridbazaar/GridBazaarLayout';
import { GridBazaarHomepage } from '@/components/gridbazaar/GridBazaarHomepage';
import { GridBazaarAuth } from '@/components/gridbazaar/GridBazaarAuth';
import { GridBazaarListings } from '@/components/gridbazaar/GridBazaarListings';
import { GridBazaarDashboard } from '@/components/gridbazaar/GridBazaarDashboard';
import { GridBazaarProfile } from '@/components/gridbazaar/GridBazaarProfile';
import { GridBazaarCreateListing } from '@/components/gridbazaar/GridBazaarCreateListing';
import { GridBazaarEditListing } from '@/components/gridbazaar/GridBazaarEditListing';
import { GridBazaarListingDetail } from '@/components/gridbazaar/GridBazaarListingDetail';
import { GridBazaarMessages } from '@/components/gridbazaar/GridBazaarMessages';
import { GridBazaarWatchlist } from '@/components/gridbazaar/GridBazaarWatchlist';
import { GridBazaarVerificationCenter } from '@/components/gridbazaar/GridBazaarVerificationCenter';
import { GridBazaarAdvancedSearch } from '@/components/gridbazaar/GridBazaarAdvancedSearch';
import { GridBazaarNotificationCenter } from '@/components/gridbazaar/GridBazaarNotificationCenter';
import { useGridBazaarAuth } from '@/contexts/GridBazaarAuthContext';
import { GridBazaarDocumentCenter } from '@/components/gridbazaar/GridBazaarDocumentCenter';
import { GridBazaarAdvancedPortfolio } from '@/components/gridbazaar/GridBazaarAdvancedPortfolio';
import { GridBazaarLOICenter } from '@/components/gridbazaar/GridBazaarLOICenter';
import { GridBazaarDueDiligenceCenter } from '@/components/gridbazaar/GridBazaarDueDiligenceCenter';
import { GridBazaarContactMessages } from '@/components/gridbazaar/GridBazaarContactMessages';
import { GridBazaarDocumentRequests } from '@/components/gridbazaar/GridBazaarDocumentRequests';
import { GridBazaarInvestmentCalculator } from '@/components/gridbazaar/GridBazaarInvestmentCalculator';
import { GridBazaarMarketReports } from '@/components/gridbazaar/GridBazaarMarketReports';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';

export const GridBazaar = () => {
  const { user, loading } = useGridBazaarAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <GridBazaarLayout>
          <GridBazaarHomepage />
        </GridBazaarLayout>
      } />
      <Route path="/home" element={
        <GridBazaarLayout>
          <GridBazaarHomepage />
        </GridBazaarLayout>
      } />
      <Route path="/auth" element={<GridBazaarAuth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/listings" element={
        <GridBazaarLayout>
          <GridBazaarListings />
        </GridBazaarLayout>
      } />
      <Route path="/listings/:id" element={
        <GridBazaarLayout>
          <GridBazaarListingDetail />
        </GridBazaarLayout>
      } />
      <Route path="/search" element={
        <GridBazaarLayout>
          <GridBazaarAdvancedSearch />
        </GridBazaarLayout>
      } />
      <Route path="/dashboard" element={
        <GridBazaarLayout>
          {user ? <GridBazaarDashboard /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/documents" element={
        <GridBazaarLayout>
          {user ? <GridBazaarDocumentCenter /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/portfolio" element={
        <GridBazaarLayout>
          {user ? <GridBazaarAdvancedPortfolio /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/loi-center" element={
        <GridBazaarLayout>
          {user ? <GridBazaarLOICenter /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/due-diligence" element={
        <GridBazaarLayout>
          {user ? <GridBazaarDueDiligenceCenter /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/profile" element={
        <GridBazaarLayout>
          {user && !loading ? <GridBazaarProfile /> : (!loading ? <GridBazaarAuth /> : <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>)}
        </GridBazaarLayout>
      } />
      <Route path="/verification" element={
        <GridBazaarLayout>
          {user && !loading ? <GridBazaarVerificationCenter /> : (!loading ? <GridBazaarAuth /> : <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>)}
        </GridBazaarLayout>
      } />
      <Route path="/create-listing" element={
        <GridBazaarLayout>
          {user ? <GridBazaarCreateListing /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/edit-listing/:id" element={
        <GridBazaarLayout>
          {user ? <GridBazaarEditListing /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/contact-messages" element={
        <GridBazaarLayout>
          {user ? <GridBazaarContactMessages /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/document-requests" element={
        <GridBazaarLayout>
          {user ? <GridBazaarDocumentRequests /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/notifications" element={
        <GridBazaarLayout>
          {user ? <GridBazaarNotificationCenter /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/watchlist" element={
        <GridBazaarLayout>
          {user ? <GridBazaarWatchlist /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
      <Route path="/calculator" element={
        <GridBazaarLayout>
          <GridBazaarInvestmentCalculator />
        </GridBazaarLayout>
      } />
      <Route path="/reports" element={
        <GridBazaarLayout>
          <GridBazaarMarketReports />
        </GridBazaarLayout>
      } />
      <Route path="/messages" element={
        <GridBazaarLayout>
          {user ? <GridBazaarMessages /> : <GridBazaarAuth />}
        </GridBazaarLayout>
      } />
    </Routes>
  );
};