import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  List, 
  Search, 
  BarChart3, 
  FileText, 
  Heart, 
  MessageSquare,
  Calculator,
  TrendingUp,
  Shield,
  Briefcase,
  FolderOpen
} from 'lucide-react';
import { useGridBazaarAuth } from '@/contexts/GridBazaarAuthContext';

const navigation = [
  { name: 'Home', href: '/gridbazaar', icon: Home },
  { name: 'Listings', href: '/gridbazaar/listings', icon: List },
  { name: 'Search', href: '/gridbazaar/search', icon: Search },
  { name: 'Calculator', href: '/gridbazaar/calculator', icon: Calculator },
  { name: 'Market Reports', href: '/gridbazaar/reports', icon: TrendingUp },
];

const authenticatedNavigation = [
  { name: 'Dashboard', href: '/gridbazaar/dashboard', icon: BarChart3 },
  { name: 'Portfolio', href: '/gridbazaar/portfolio', icon: Briefcase },
  { name: 'Watchlist', href: '/gridbazaar/watchlist', icon: Heart },
  { name: 'Messages', href: '/gridbazaar/messages', icon: MessageSquare },
  { name: 'Documents', href: '/gridbazaar/documents', icon: FolderOpen },
  { name: 'LOI Center', href: '/gridbazaar/loi-center', icon: FileText },
  { name: 'Verification', href: '/gridbazaar/verification', icon: Shield },
];

export const GridBazaarSidebar = () => {
  const location = useLocation();
  const { user } = useGridBazaarAuth();

  return (
    <aside className="w-64 border-r bg-card h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}

        {user && (
          <>
            <div className="border-t my-4" />
            {authenticatedNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
};