import React, { useState } from 'react';
import { SocialFeed } from './SocialFeed';
import { ComposePost } from './ComposePost';
import { TrendingSidebar } from './TrendingSidebar';
import { SocialSearch } from './SocialSearch';
import { UserProfile } from './UserProfile';
import { Notifications } from './Notifications';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Search, 
  Bell, 
  User, 
  Hash,
  MessageCircle,
  Users,
  Plus
} from 'lucide-react';

type ViewType = 'feed' | 'search' | 'notifications' | 'profile' | 'compose';

export const SocialNetworkHub = () => {
  const [currentView, setCurrentView] = useState<ViewType>('feed');

  const navigationItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'feed':
        return <SocialFeed />;
      case 'search':
        return <SocialSearch />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <UserProfile />;
      case 'compose':
        return <ComposePost onClose={() => setCurrentView('feed')} />;
      default:
        return <SocialFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto flex">
        {/* Left Sidebar Navigation */}
        <div className="w-56 xl:w-64 fixed h-full border-r bg-card/50 backdrop-blur-sm p-3 xl:p-4 hidden lg:block z-30">
          <div className="space-y-2">
            <div className="px-4 py-2 font-bold text-xl text-watt-primary">
              VoltMarket Social
            </div>
            <Separator className="my-4" />
            
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-start h-12 text-left ${
                    currentView === item.id ? 'bg-watt-gradient text-white' : ''
                  }`}
                  onClick={() => setCurrentView(item.id as ViewType)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              );
            })}
            
            <Separator className="my-4" />
            
            <Button
              onClick={() => setCurrentView('compose')}
              className="w-full bg-watt-gradient hover:opacity-90 h-12"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-56 xl:ml-64">
          <div className="flex">
            {/* Center Content */}
            <div className="flex-1 max-w-2xl mx-auto lg:border-x min-h-screen">
              {/* Mobile Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b p-3 sm:p-4 lg:hidden z-20 safe-area-pt">
                <div className="flex items-center justify-between">
                  <h1 className="font-bold text-lg sm:text-xl text-watt-primary">
                    VoltMarket Social
                  </h1>
                  <Button
                    onClick={() => setCurrentView('compose')}
                    size="sm"
                    className="bg-watt-gradient touch-target min-h-[40px] min-w-[40px]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="sticky top-[60px] sm:top-[68px] bg-background/95 backdrop-blur-md border-b p-2 lg:hidden z-10">
                <div className="flex justify-center space-x-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={currentView === item.id ? 'default' : 'ghost'}
                        size="sm"
                        className={`touch-target min-h-[44px] min-w-[44px] flex-1 max-w-[80px] ${currentView === item.id ? 'bg-watt-gradient text-white' : ''}`}
                        onClick={() => setCurrentView(item.id as ViewType)}
                      >
                        <Icon className="w-5 h-5" />
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Content Area */}
              <div className="min-h-screen pb-safe lg:pb-0">
                {renderCurrentView()}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-72 xl:w-80 p-3 xl:p-4 hidden xl:block">
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};