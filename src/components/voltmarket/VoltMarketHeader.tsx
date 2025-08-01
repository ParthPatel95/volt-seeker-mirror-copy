// Updated 2025-07-10 - GridBazaar Header
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  User, 
  MessageSquare, 
  Heart, 
  Settings,
  LogOut,
  Plus,
  Menu,
  TestTube,
  FileText,
  TrendingUp,
  Trophy,
  Users,
  MoreHorizontal,
  Shield,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';
import { useResponsiveNavigation, NavigationItem } from '@/hooks/useResponsiveNavigation';
import { useVoltMarketRealtime } from '@/hooks/useVoltMarketRealtime';

export const VoltMarketHeader: React.FC = () => {
  const { user, profile, signOut } = useVoltMarketAuth();
  const { messages } = useVoltMarketRealtime();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Count unread messages
  const unreadCount = messages.filter(m => !m.is_read && m.recipient_id === profile?.id).length;

  // Visible navigation items (only show Browse and Messages prominently)
  const visibleNavItems: NavigationItem[] = user ? [
    { id: 'browse', label: 'Browse', icon: Search, priority: 1, path: '/listings' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, priority: 2, path: '/contact-messages', badge: unreadCount },
  ] : [
    { id: 'browse', label: 'Browse', icon: Search, priority: 1, path: '/listings' },
  ];

  // Items that go in the dropdown
  const dropdownItems: NavigationItem[] = user ? [
    { id: 'network', label: 'Network', icon: Users, priority: 3, path: '/social-hub' },
    { id: 'documents', label: 'Documents', icon: FileText, priority: 4, path: '/documents' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, priority: 5, path: '/financial-intelligence' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, priority: 6, path: '/achievements' },
    { id: 'loi-center', label: 'LOI Center', icon: FileText, priority: 7, path: '/loi-center' },
    { id: 'getting-verified', label: 'Getting Verified', icon: CheckCircle, priority: 8, path: '/getting-verified' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, priority: 9, path: '/portfolio' },
  ] : [];

  // Use our custom visible items instead of responsive navigation hook for better control
  const hasDropdownItems = dropdownItems.length > 0;

  // Check if route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    console.log('Header sign out clicked');
    try {
      const result = await signOut();
      if (result.error) {
        console.error('Sign out failed:', result.error);
      } else {
        console.log('Navigating to / after sign out');
        navigate('/');
      }
    } catch (err) {
      console.error('Sign out handler error:', err);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 min-w-0">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-2 min-w-0 touch-target">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm">GB</span>
              </div>
              <span className="hidden xs:block text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">GridBazaar</span>
            </Link>
          </div>


          {/* Responsive Navigation */}
          <nav className="hidden sm:flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
            {/* Always visible navigation items */}
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path!);
              return (
                <Link key={item.id} to={item.path!}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    size="sm"
                    className={`relative whitespace-nowrap touch-target min-h-[40px] ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline ml-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center p-0">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}

            
            {user && (
              <>
                <Link to="/create-listing">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 touch-target min-h-[40px]">
                    <Plus className="w-4 h-4" />
                    <span className="hidden md:inline ml-1">List</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 touch-target min-h-[40px] px-2">
                      <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
                        <AvatarImage 
                          src={profile?.profile_image_url || ""} 
                          alt="Profile"
                          className="aspect-square h-full w-full object-cover"
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {getInitials(profile?.company_name || 'Account')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm truncate max-w-32">{profile?.company_name || 'Account'}</span>
                      {profile?.role === 'seller' && (
                        <Badge variant="secondary" className="hidden lg:flex ml-2 text-xs">
                          Seller
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                    <div className="p-3 border-b">
                      <div className="font-medium text-sm">{profile?.company_name || 'User'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link to="/watchlist" className="cursor-pointer">
                         <Heart className="w-4 h-4 mr-2" />
                         Watchlist
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     {dropdownItems.map((item) => {
                       const Icon = item.icon;
                       const isActive = isActiveRoute(item.path!);
                       return (
                         <DropdownMenuItem key={item.id} asChild>
                           <Link to={item.path!} className={`cursor-pointer ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}>
                             <Icon className="w-4 h-4 mr-2" />
                             {item.label}
                             {item.badge && item.badge > 0 && (
                               <Badge className="ml-auto bg-red-500 text-white text-xs">
                                 {item.badge}
                               </Badge>
                             )}
                           </Link>
                         </DropdownMenuItem>
                       );
                     })}
                     <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {!user && (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth?signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden touch-target min-h-[40px] min-w-[40px]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-3 border-t bg-white safe-area-pb">
            <div className="flex flex-col space-y-2">
              
              {/* All navigation items in mobile */}
              {[...visibleNavItems, ...dropdownItems].map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path!);
                return (
                  <Link key={item.id} to={item.path!} onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start touch-target min-h-[44px] text-base ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <Badge className="ml-auto bg-red-500 text-white text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
              
              {user ? (
                <>
                  <Link to="/create-listing" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 touch-target min-h-[44px] text-base">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Listing
                    </Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start touch-target min-h-[44px] text-base">
                      <User className="w-5 h-5 mr-3" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start touch-target min-h-[44px] text-base">
                      <Settings className="w-5 h-5 mr-3" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-red-600 touch-target min-h-[44px] text-base" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start touch-target min-h-[44px] text-base">Sign In</Button>
                  </Link>
                  <Link to="/auth?signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 touch-target min-h-[44px] text-base">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};