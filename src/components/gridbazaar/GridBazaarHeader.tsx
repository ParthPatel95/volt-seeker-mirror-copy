import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGridBazaarAuth } from '@/contexts/GridBazaarAuthContext';
import { useNavigate } from 'react-router-dom';

export const GridBazaarHeader = () => {
  const { user, signOut } = useGridBazaarAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/gridbazaar/auth');
  };

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-6">
        <Link to="/gridbazaar" className="font-bold text-xl text-primary">
          GridBazaar
        </Link>
        
        <div className="ml-8 flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search listings..." 
              className="pl-10"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <Link to="/gridbazaar/create-listing">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </Link>
          )}

          {user && (
            <Link to="/gridbazaar/notifications">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="ml-1 text-xs">3</Badge>
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/gridbazaar/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/gridbazaar/dashboard">
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/gridbazaar/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};