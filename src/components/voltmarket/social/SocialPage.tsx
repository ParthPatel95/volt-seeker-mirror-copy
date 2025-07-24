import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialFeed } from './SocialFeed';
import { SocialExplore } from './SocialExplore';
import { SocialNotifications } from './SocialNotifications';
import { MessageSquare, Compass, Bell } from 'lucide-react';
import { useVoltMarketListingAnnouncements } from '@/hooks/useVoltMarketListingAnnouncements';

export const SocialPage = () => {
  // Initialize automatic listing announcements
  useVoltMarketListingAnnouncements();
  return (
    <div className="container-responsive py-6 animate-fade-in">
      {/* Hero Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-watt-gradient rounded-2xl mb-4 shadow-watt-glow">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-watt-gradient bg-clip-text text-transparent mb-2">
          Energy Network
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect with energy professionals, share insights, and stay updated on industry trends in the power infrastructure marketplace
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-watt-primary/10 rounded-xl p-1 shadow-lg">
          <TabsTrigger 
            value="feed" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Feed</span>
          </TabsTrigger>
          <TabsTrigger 
            value="explore" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300"
          >
            <Compass className="w-4 h-4" />
            <span className="font-medium">Explore</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300"
          >
            <Bell className="w-4 h-4" />
            <span className="font-medium">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-8 animate-fade-up">
          <SocialFeed />
        </TabsContent>

        <TabsContent value="explore" className="mt-8 animate-fade-up">
          <SocialExplore />
        </TabsContent>

        <TabsContent value="notifications" className="mt-8 animate-fade-up">
          <SocialNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};