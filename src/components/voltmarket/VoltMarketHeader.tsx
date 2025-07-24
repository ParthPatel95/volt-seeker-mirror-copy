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
  MoreHorizontal
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
  ];

  const { visibleItems, hiddenItems, hasHiddenItems } = useResponsiveNavigation(allNavItems);

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
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 min-w-0">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="hidden sm:block text-white font-bold text-sm">GB</span>
              </div>
              <span className="hidden sm:block text-lg sm:text-xl font-bold text-gray-900 truncate">GridBazaar</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full text-sm"
                />
              </div>
            </form>
          </div>

          {/* Responsive Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-shrink-0 overflow-hidden">
            {/* Visible navigation items */}
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path!);
              return (
                <Link key={item.id} to={item.path!}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    size="sm"
                    className={`relative ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}
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

            {/* More dropdown for hidden items */}
            {hasHiddenItems && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="hidden lg:inline ml-1">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg z-50">
                  {hiddenItems.map((item) => {
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {user && (
              <>
                <Link to="/create-listing">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    <span className="hidden lg:inline ml-1">List</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={profile?.profile_image_url || ""} 
                          alt="Profile"
                          className="aspect-square h-full w-full object-cover"
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {getInitials(profile?.company_name || 'Account')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:block">{profile?.company_name || 'Account'}</span>
                      {profile?.role === 'seller' && (
                        <Badge variant="secondary" className="ml-2 text-xs">
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
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </form>
              
              {/* All navigation items in mobile */}
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path!);
                return (
                  <Link key={item.id} to={item.path!} onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}
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
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                  </Link>
                  <Link to="/auth?signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up</Button>
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