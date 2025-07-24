
import React from 'react';
import { VoltMarketNavigation } from './VoltMarketNavigation';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

interface VoltMarketLayoutProps {
  children: React.ReactNode;
}

const VoltMarketLayoutContent: React.FC<VoltMarketLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-watt-light/20 to-background">
      {/* New Unified Navigation */}
      <VoltMarketNavigation />

      {/* Main Content with mobile bottom navigation spacing */}
      <main className="pb-20 lg:pb-0 px-2 sm:px-4 lg:px-6">
        {children}
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand section - takes more space */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-watt-primary to-watt-primary/70 shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-foreground tracking-tight">GridBazaar</span>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                  The premier marketplace for energy infrastructure assets, connecting buyers and sellers worldwide with cutting-edge technology and unparalleled security.
                </p>
              </div>
              
              {/* Status badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-watt-success/10 border border-watt-success/20">
                  <div className="w-2 h-2 rounded-full bg-watt-success animate-pulse"></div>
                  <span className="text-xs font-medium text-watt-success">Real-time Enabled</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-watt-primary/10 border border-watt-primary/20">
                  <div className="w-2 h-2 rounded-full bg-watt-primary"></div>
                  <span className="text-xs font-medium text-watt-primary">Enhanced Security</span>
                </div>
              </div>
            </div>
            
            {/* Navigation sections */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground relative">
                  Platform
                  <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-watt-primary to-transparent rounded-full"></div>
                </h3>
                <nav className="space-y-3">
                  <Link to="/listings" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    Browse & Search Listings
                  </Link>
                  <Link to="/portfolio" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    Portfolio Manager
                  </Link>
                  <Link to="/documents" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    Document Center
                  </Link>
                  <Link to="/loi-center" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    LOI Center
                  </Link>
                  <Link to="/due-diligence" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    Due Diligence
                  </Link>
                  <Link to="/verification" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    Get Verified
                  </Link>
                </nav>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground relative">
                  Company
                  <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-watt-primary to-transparent rounded-full"></div>
                </h3>
                <nav className="space-y-3">
                  <a href="/privacy-policy" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    Privacy Policy
                  </a>
                  <a href="/terms-of-service" className="block text-sm text-muted-foreground hover:text-watt-primary transition-all duration-200 hover:translate-x-1 transform">
                    Terms of Service
                  </a>
                </nav>
              </div>
            </div>
            
            {/* CTA or additional info section */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-lg font-semibold text-foreground relative">
                Stay Connected
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-watt-primary to-transparent rounded-full"></div>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join thousands of professionals transforming the energy infrastructure landscape.
              </p>
              <Link 
                to="/auth" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-watt-primary to-watt-primary/80 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-watt-primary/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                Get Started Today
                <Zap className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="border-t border-border/30 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <p className="text-sm text-muted-foreground">
                  © 2025 GridBazaar. All rights reserved.
                </p>
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Made with</span>
                  <span className="text-red-500">♥</span>
                  <span>for the energy future</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const VoltMarketLayout: React.FC<VoltMarketLayoutProps> = ({ children }) => {
  return (
    <VoltMarketLayoutContent>
      {children}
    </VoltMarketLayoutContent>
  );
};
