import React from 'react';
import { GridBazaarHeader } from './GridBazaarHeader';
import { GridBazaarSidebar } from './GridBazaarSidebar';

interface GridBazaarLayoutProps {
  children: React.ReactNode;
}

export const GridBazaarLayout: React.FC<GridBazaarLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <GridBazaarHeader />
      <div className="flex">
        <GridBazaarSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};