import React from 'react';

export const VoltMarketAdvancedPortfolio: React.FC = () => {
  return (
    <div className="p-8">
      <div className="bg-card rounded-lg border p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Portfolio Dashboard</h1>
        <p className="text-muted-foreground">This is a test to see if the portfolio page renders.</p>
        <div className="mt-4 p-4 bg-primary/10 rounded">
          <p className="text-sm">If you can see this, the portfolio route is working!</p>
        </div>
      </div>
    </div>
  );
};