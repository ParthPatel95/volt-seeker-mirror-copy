import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialFeed } from './SocialFeed';
import { SocialExplore } from './SocialExplore';
import { SocialNotifications } from './SocialNotifications';
import { MessageSquare, Compass, Bell } from 'lucide-react';

export const SocialPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Energy Network</h1>
        <p className="text-muted-foreground mt-2">
          Connect with energy professionals, share insights, and stay updated on industry trends
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Feed</span>
          </TabsTrigger>
          <TabsTrigger value="explore" className="flex items-center space-x-2">
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <SocialFeed />
        </TabsContent>

        <TabsContent value="explore" className="mt-6">
          <SocialExplore />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <SocialNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};