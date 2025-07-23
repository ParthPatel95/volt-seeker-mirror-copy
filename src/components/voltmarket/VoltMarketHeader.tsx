
// Updated 2025-07-10 - GridBazaar Header
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  TestTube
} from 'lucide-react';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

export const VoltMarketHeader: React.FC = () => {
  const { user, profile, signOut } = useVoltMarketAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                {/* Hide GB text on mobile, show on sm+ screens */}
                <span className="hidden sm:block text-white font-bold text-sm">GB</span>
              </div>
              {/* Hide company name on mobile, show on sm+ screens */}
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <Link to="/listings">
              <Button variant="ghost">Browse</Button>
            </Link>
            
            {user ? (
              <>
              <Link to="/create-listing">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  List
                </Button>
              </Link>
              
              <Link to="/notifications">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/qa-test">
                <Button variant="outline" size="sm" title="QA Testing">
                  <TestTube className="w-4 h-4" />
                </Button>
              </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        {(() => {
                          console.log('🔍 Avatar debug - profile:', profile);
                          console.log('🔍 Avatar debug - profile_image_url:', profile?.profile_image_url);
                          console.log('🔍 Avatar debug - condition result:', !!profile?.profile_image_url);
                          return null;
                        })()}
                        {profile?.profile_image_url && (
                          <AvatarImage 
                            src={profile.profile_image_url} 
                            alt="Profile"
                            className="aspect-square h-full w-full object-cover"
                            onLoad={() => console.log('✅ Avatar loaded:', profile.profile_image_url)}
                            onError={(e) => {
                              console.error('❌ Avatar failed to load:', profile.profile_image_url);
                              console.error('Error details:', e.currentTarget.src);
                            }}
                          />
                        )}
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
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
          <div className="md:hidden py-4 border-t">
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
              
              <Link to="/listings" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Browse</Button>
              </Link>
              
              {user ? (
                <>
                  <Link to="/create-listing" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
                  <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Notifications</Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                  </Link>
                  <Link to="/qa-test" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <TestTube className="w-4 h-4 mr-2" />
                      QA Test
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
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
