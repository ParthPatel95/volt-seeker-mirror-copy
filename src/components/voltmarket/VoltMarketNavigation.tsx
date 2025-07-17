import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Building2,
  Search,
  FileText,
  Settings,
  Bell,
  Star,
  Calculator,
  BarChart3,
  Home
} from 'lucide-react';
import { useVoltMarketAuth } from '@/contexts/VoltMarketAuthContext';

export const VoltMarketNavigation: React.FC = () => {
  const { user, profile, signOut } = useVoltMarketAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/voltmarket/auth');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/voltmarket" className="flex items-center space-x-2">
          <div className="p-1.5 bg-watt-gradient rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">GridBazaar</span>
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{profile?.role || 'User'}</Badge>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Link to="/voltmarket/auth">
            <Button className="bg-watt-gradient hover:opacity-90">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};