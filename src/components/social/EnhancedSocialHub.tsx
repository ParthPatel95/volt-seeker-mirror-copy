import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useSocialCollaboration } from '@/hooks/useSocialCollaboration';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  Users, 
  Plus,
  Hash,
  Globe,
  Lock,
  Zap
} from 'lucide-react';

export const EnhancedSocialHub = () => {
  const {
    posts,
    messages,
    channels,
    loading,
    createPost,
    loadFeed,
    interactWithPost,
    sendMessage,
    loadMessages,
    createChannel,
    joinChannel,
  } = useSocialCollaboration();

  const [newPostContent, setNewPostContent] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [showNewChannelForm, setShowNewChannelForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');

  useEffect(() => {
    loadFeed();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    await createPost({
      content: newPostContent,
      post_type: 'general',
      visibility: 'public'
    });
    
    setNewPostContent('');
  };

  const handleLikePost = async (postId: string) => {
    await interactWithPost(postId, 'like');
  };

  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || !selectedChannel) return;
    
    await sendMessage({
      channel_id: selectedChannel,
      content: newMessageContent,
      message_type: 'text'
    });
    
    setNewMessageContent('');
  };

  const handleCreateChannel = async () => {
    if (!newChannelName.trim()) return;
    
    await createChannel({
      name: newChannelName,
      description: newChannelDescription,
      channel_type: 'public'
    });
    
    setNewChannelName('');
    setNewChannelDescription('');
    setShowNewChannelForm(false);
  };

  const handleChannelSelect = async (channelId: string) => {
    setSelectedChannel(channelId);
    await loadMessages(channelId);
  };

  return (
    <div className="container-responsive py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-watt-gradient rounded-2xl mb-4 shadow-watt-glow">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-watt-primary mb-2">
          Social Collaboration Hub
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect, collaborate, and share insights with the energy community
        </p>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-watt-primary/10 rounded-xl p-1 shadow-lg">
          <TabsTrigger 
            value="feed" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white rounded-lg"
          >
            <Globe className="w-4 h-4" />
            <span>Social Feed</span>
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white rounded-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger 
            value="channels" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white rounded-lg"
          >
            <Hash className="w-4 h-4" />
            <span>Channels</span>
          </TabsTrigger>
        </TabsList>

        {/* Social Feed */}
        <TabsContent value="feed" className="space-y-6">
          {/* Create Post */}
          <Card className="border-watt-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-watt-primary" />
                Share Your Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's happening in the energy sector?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-24 border-watt-primary/20 focus:border-watt-primary"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-watt-primary/30">General</Badge>
                  <Badge variant="outline" className="border-watt-primary/30">Public</Badge>
                </div>
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || loading}
                  className="bg-watt-gradient hover:opacity-90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="border-watt-primary/10 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback>
                        {post.profiles?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{post.profiles?.full_name || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-watt-primary/30">
                          {post.post_type}
                        </Badge>
                      </div>
                      <p className="text-foreground leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-6 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                          className="text-muted-foreground hover:text-watt-primary"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes_count}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-watt-primary"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments_count}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-watt-primary"
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {post.shares_count}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Messages */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Channel List */}
            <Card className="border-watt-primary/10 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Channels</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowNewChannelForm(true)}
                    className="bg-watt-gradient hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedChannel === channel.id
                            ? 'bg-watt-gradient text-white'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleChannelSelect(channel.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <p className="text-sm opacity-80 mt-1">{channel.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="lg:col-span-2">
              <Card className="border-watt-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle>
                    {selectedChannel ? 'Channel Messages' : 'Select a Channel'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChannel ? (
                    <div className="space-y-4">
                      <ScrollArea className="h-64 border rounded-lg p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div key={message.id} className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={message.sender?.avatar_url} />
                                <AvatarFallback>
                                  {message.sender?.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">
                                    {message.sender?.full_name || 'Anonymous'}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessageContent}
                          onChange={(e) => setNewMessageContent(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="border-watt-primary/20 focus:border-watt-primary"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessageContent.trim()}
                          className="bg-watt-gradient hover:opacity-90"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Select a channel to start messaging</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Channels Management */}
        <TabsContent value="channels" className="space-y-6">
          {showNewChannelForm && (
            <Card className="border-watt-primary/10 shadow-lg">
              <CardHeader>
                <CardTitle>Create New Channel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="border-watt-primary/20 focus:border-watt-primary"
                />
                <Textarea
                  placeholder="Channel description"
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  className="border-watt-primary/20 focus:border-watt-primary"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateChannel}
                    disabled={!newChannelName.trim()}
                    className="bg-watt-gradient hover:opacity-90"
                  >
                    Create Channel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewChannelForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <Card key={channel.id} className="border-watt-primary/10 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-watt-primary" />
                      <h3 className="font-semibold">{channel.name}</h3>
                    </div>
                    <Badge variant="outline" className="border-watt-primary/30">
                      {channel.channel_type === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {channel.member_count} members
                    </span>
                    <Button
                      size="sm"
                      onClick={() => joinChannel(channel.id)}
                      className="bg-watt-gradient hover:opacity-90"
                    >
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};