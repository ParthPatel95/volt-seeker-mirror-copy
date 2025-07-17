import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VoltMarketLayout } from '@/components/voltmarket/VoltMarketLayout';
import { VoltMarketHomepage } from '@/components/voltmarket/VoltMarketHomepage';
import { WattbytesAuth } from '@/components/voltmarket/WattbytesAuth';

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
    </Routes>
  );
};
