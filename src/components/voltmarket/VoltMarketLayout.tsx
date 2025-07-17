import React from 'react';
import { VoltMarketNavigation } from './VoltMarketNavigation';

interface VoltMarketLayoutProps {
  children: React.ReactNode;
}

export const VoltMarketLayout: React.FC<VoltMarketLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-watt-light/20 to-background">
      <VoltMarketNavigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};