import React, { useState, useEffect } from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { PostCard } from './PostCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Edit3,
  Mail,
  Users,
  MessageSquare,
  Heart,
  Settings
} from 'lucide-react';

export const UserProfile = () => {
  const { profile, posts, updateProfile, followUser, unfollowUser } = useSocialNetwork();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
    header_url: ''
  });
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (profile) {
        setEditedProfile({
          username: profile.username || '',
          display_name: profile.display_name || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          avatar_url: profile.avatar_url || '',
          header_url: profile.header_url || ''
        });
      }
      setLoading(false);
    };

    getCurrentUser();
  }, [profile]);

  useEffect(() => {
    // Filter posts by current user
    if (posts && currentUser) {
      const filteredPosts = posts.filter(post => post.user_id === currentUser.id);
      setUserPosts(filteredPosts);
    }
  }, [posts, currentUser]);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || currentUser?.user_metadata?.full_name || 'Anonymous User';
  const username = profile?.username || currentUser?.email?.split('@')[0] || 'anonymous';
  const avatarUrl = profile?.avatar_url || currentUser?.user_metadata?.avatar_url;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4 lg:hidden z-10">
        <h2 className="text-xl font-bold">Profile</h2>
      </div>

      {/* Cover Image */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-watt-primary/10 to-watt-secondary/10 border-b overflow-hidden">
        {profile?.header_url ? (
          <img 
            src={profile.header_url} 
            alt="Profile header" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-muted/40"></div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4 -mt-12 sm:-mt-16 relative">
        <div className="flex flex-col space-y-4 mb-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-background self-start">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="text-xl sm:text-2xl">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">{displayName}</h1>
                <p className="text-muted-foreground text-sm sm:text-base">@{username}</p>
              </div>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 sm:mt-0 self-start">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      value={editedProfile.username}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Your username"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      value={editedProfile.display_name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Profile Picture URL</label>
                    <Input
                      value={editedProfile.avatar_url}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
                      placeholder="https://example.com/profile-picture.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Banner Image URL</label>
                    <Input
                      value={editedProfile.header_url}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, header_url: e.target.value }))}
                      placeholder="https://example.com/banner-image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your location"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <Input
                      value={editedProfile.website}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://your-website.com"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleProfileUpdate} className="bg-watt-gradient hover:opacity-90">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Bio and Details */}
        <div className="space-y-3 mb-6">
          {profile?.bio && (
            <p className="text-sm">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile?.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon className="w-4 h-4" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-watt-primary hover:underline">
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(currentUser?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 text-sm">
            <div>
              <span className="font-bold">{profile?.following_count || 0}</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </div>
            <div>
              <span className="font-bold">{profile?.followers_count || 0}</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </div>
            <div>
              <span className="font-bold">{userPosts.length}</span>
              <span className="text-muted-foreground ml-1">Posts</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-0 mt-4">
            {userPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No posts yet</h3>
                <p className="text-sm text-muted-foreground">
                  When you post something, it will appear here.
                </p>
              </Card>
            ) : (
              userPosts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="media" className="mt-4">
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">Media posts will appear here</div>
            </Card>
          </TabsContent>
          
          <TabsContent value="likes" className="mt-4">
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">Liked posts will appear here</div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};