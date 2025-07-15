import React from 'react';

interface VoltMarketLayoutProps {
  children: React.ReactNode;
}

const VoltMarketLayout = ({ children }: VoltMarketLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default VoltMarketLayout;