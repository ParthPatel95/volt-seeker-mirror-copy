import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home,
  Search, 
  MessageSquare, 
  Heart,
  User, 
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  Zap,
  Shield,
  BarChart3,
  ChevronDown,
  Briefcase,
  FileText,
  Scale,
  Trophy,
  TrendingUp,
  Users
} from 'lucide-react';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { useVoltMarketRealtime } from '@/hooks/useVoltMarketRealtime';
import { useResponsiveNavigation, NavigationItem } from '@/hooks/useResponsiveNavigation';

export const VoltMarketNavigation: React.FC = () => {
  const { user, profile, signOut } = useVoltMarketAuth();
  const { messages } = useVoltMarketRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Count unread messages
  const unreadCount = messages.filter(m => !m.is_read && m.recipient_id === profile?.id).length;

  // Get user initials
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U';
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate immediately after sign out
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      // Navigate even if there's an error to avoid getting stuck
      navigate('/', { replace: true });
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // All navigation items for responsive navigation
  const allNavItems: NavigationItem[] = user ? [
    { id: 'browse', label: 'Browse', icon: Search, priority: 1, path: '/listings' },
    { id: 'network', label: 'Network', icon: Users, priority: 2, path: '/social-hub' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, priority: 3, path: '/contact-messages', badge: unreadCount },
    { id: 'documents', label: 'Documents', icon: FileText, priority: 4, path: '/documents' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, priority: 5, path: '/financial-intelligence' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, priority: 6, path: '/achievements' },
  ] : [
    { id: 'browse', label: 'Browse', icon: Search, priority: 1, path: '/listings' },
    { id: 'network', label: 'Network', icon: Users, priority: 2, path: '/social-hub' },
  ];

  const { visibleItems, hiddenItems, hasHiddenItems } = useResponsiveNavigation(allNavItems);

  console.log('VoltMarketNavigation rendering - this should be the ONLY navigation');
  return (
    <>
      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-18 min-w-0">
            {/* Logo & Brand - Enhanced */}
            <div className="flex-shrink-0 min-w-0">
              <Link to="/" className="flex items-center gap-3 group min-w-0 py-2">
                <div className="relative p-2.5 bg-gradient-to-br from-watt-primary to-watt-secondary rounded-2xl group-hover:scale-105 transition-all duration-300 flex-shrink-0 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-watt-primary to-watt-secondary rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="hidden sm:flex flex-col min-w-0">
                  <span className="text-xl font-bold bg-gradient-to-r from-watt-primary via-watt-secondary to-watt-primary bg-clip-text text-transparent truncate">
                    GridBazaar
                  </span>
                  <span className="text-xs text-muted-foreground/80 -mt-0.5 hidden lg:block truncate font-medium">Energy Infrastructure Marketplace</span>
                </div>
                <span className="sm:hidden text-xl font-bold bg-gradient-to-r from-watt-primary to-watt-secondary bg-clip-text text-transparent">GB</span>
              </Link>
            </div>

            {/* Responsive Navigation - Enhanced Design */}
            <div className="hidden md:flex items-center justify-center flex-1 min-w-0">
              <nav className="flex items-center gap-1 bg-muted/50 rounded-full p-1 border border-border/50">
                {/* Visible navigation items */}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.path || '');
                  return (
                    <Link
                      key={item.id}
                      to={item.path || '/'}
                      className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group ${
                        isActive 
                          ? 'text-watt-primary bg-background shadow-md scale-105' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                      <span className="hidden lg:inline font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-watt-warning to-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-watt-primary/10 to-watt-secondary/10 -z-10"></div>
                      )}
                    </Link>
                  );
                })}

                {/* More dropdown for hidden items */}
                {hasHiddenItems && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="px-4 py-2.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/60">
                        <Menu className="w-4 h-4" />
                        <span className="hidden lg:inline ml-2">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl">
                      {hiddenItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActiveRoute(item.path || '');
                        return (
                          <DropdownMenuItem key={item.id} asChild>
                            <Link 
                              to={item.path || '/'} 
                              className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 transition-all duration-200 ${isActive ? 'text-watt-primary bg-watt-primary/10' : 'hover:bg-muted/50'}`}
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                              {item.badge && item.badge > 0 && (
                                <Badge className="ml-auto bg-gradient-to-r from-watt-warning to-orange-500 text-white text-xs shadow-lg">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </nav>
            </div>

            {/* Right Actions - Dynamic width */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0 min-w-0">
              {user ? (
                <>
                  {/* Create Listing CTA - Enhanced */}
                  {profile?.role === 'seller' && (
                    <Link to="/create-listing">
                      <Button size="sm" className="relative bg-gradient-to-r from-watt-primary to-watt-secondary hover:shadow-lg hover:scale-105 text-white shadow-md text-sm font-medium transition-all duration-300 rounded-full px-4 py-2.5">
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:inline ml-1.5">List</span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-watt-primary/20 to-watt-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                    </Link>
                  )}

                  {/* Elegant User Profile */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 p-1 hover:bg-muted/50 rounded-full min-w-0">
                        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                          <AvatarImage 
                            src={profile?.profile_image_url || ""} 
                            alt="Profile"
                            className="aspect-square h-full w-full object-cover"
                          />
                          <AvatarFallback className="bg-watt-gradient text-white font-medium text-xs sm:text-sm">
                            {getInitials(profile?.company_name || 'User')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block text-left min-w-0">
                          <div className="text-sm font-medium leading-none truncate max-w-20 xl:max-w-32">
                            {profile?.company_name?.split(' ')[0] || 'User'}
                          </div>
                          {profile?.is_id_verified && (
                            <div className="text-xs text-watt-success mt-0.5">Verified</div>
                          )}
                        </div>
                        <ChevronDown className="w-3 h-3 text-muted-foreground hidden lg:block flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-48">
                       <div className="p-3 border-b">
                         <div className="font-medium text-sm">{profile?.company_name || 'User'}</div>
                         <div className="text-xs text-muted-foreground">{user.email}</div>
                       </div>
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="cursor-pointer">
                            <User className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/portfolio" className="cursor-pointer">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Portfolio
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/documents" className="cursor-pointer">
                            <FileText className="w-4 h-4 mr-2" />
                            Documents
                          </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                           <Link to="/loi-center" className="cursor-pointer">
                             <Scale className="w-4 h-4 mr-2" />
                             LOI Center
                           </Link>
                         </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/verification" className="cursor-pointer">
                            <Shield className="w-4 h-4 mr-2" />
                            {profile?.is_id_verified ? 'Verified' : 'Get Verified'}
                            {profile?.is_id_verified && (
                              <Badge className="ml-auto bg-watt-success/10 text-watt-success border-watt-success/20 text-xs">
                                ✓
                              </Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/watchlist" className="cursor-pointer">
                            <Heart className="w-4 h-4 mr-2" />
                            Watchlist
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                         <LogOut className="w-4 h-4 mr-2" />
                         Sign Out
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-watt-primary text-sm">
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">In</span>
                    </Button>
                  </Link>
                  <Link to="/auth?signup">
                    <Button size="sm" className="bg-watt-gradient hover:opacity-90 text-white text-sm">
                      <span className="hidden sm:inline">Get Started</span>
                      <span className="sm:hidden">Start</span>
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 bg-background/95 backdrop-blur-sm max-h-96 overflow-y-auto">
              <div className="space-y-2 px-2">
                {/* All Navigation Items in Mobile */}
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.path || '');
                  return (
                    <Link
                      key={item.id}
                      to={item.path || '/'}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive 
                          ? 'text-watt-primary bg-watt-primary/5' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <Badge className="ml-auto bg-watt-warning text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}

                {user && profile?.role === 'seller' && (
                  <div className="border-t border-border/50 mt-2 pt-2">
                    <Link to="/create-listing">
                      <Button className="w-full bg-watt-gradient hover:opacity-90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/50 safe-area-pb">
          <div className="grid grid-cols-5 gap-0.5 p-1.5">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg touch-target transition-all duration-200 ${
                isActiveRoute('/') 
                  ? 'text-watt-primary bg-watt-primary/10' 
                  : 'text-muted-foreground hover:text-watt-primary'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-xs font-medium leading-none">Home</span>
            </Link>

            <Link
              to="/listings"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg touch-target transition-all duration-200 ${
                isActiveRoute('/listings') 
                  ? 'text-watt-primary bg-watt-primary/10' 
                  : 'text-muted-foreground hover:text-watt-primary'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="text-xs font-medium leading-none">Browse</span>
            </Link>

            <Link
              to="/social-hub"
              className={`relative flex flex-col items-center gap-1 p-2 rounded-lg touch-target transition-all duration-200 ${
                isActiveRoute('/social-hub') 
                  ? 'text-watt-primary bg-watt-primary/10' 
                  : 'text-muted-foreground hover:text-watt-primary'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium leading-none">Network</span>
            </Link>

            <Link
              to="/watchlist"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg touch-target transition-all duration-200 ${
                isActiveRoute('/watchlist') 
                  ? 'text-watt-primary bg-watt-primary/10' 
                  : 'text-muted-foreground hover:text-watt-primary'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium leading-none">Watchlist</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex flex-col items-center gap-1 p-2 rounded-lg touch-target transition-all duration-200 ${
                isActiveRoute('/dashboard') 
                  ? 'text-watt-primary bg-watt-primary/10' 
                  : 'text-muted-foreground hover:text-watt-primary'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-medium leading-none">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};