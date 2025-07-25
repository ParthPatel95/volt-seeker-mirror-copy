import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGamification } from '@/hooks/useGamification';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Gift, 
  Flame,
  Medal,
  Crown,
  Award,
  TrendingUp
} from 'lucide-react';

export const GamificationDashboard = () => {
  const {
    progress,
    achievements,
    leaderboard,
    availableRewards,
    loading,
    loadLeaderboard,
    redeemReward,
    getExperienceToNextLevel,
    getProgressToNextLevel,
  } = useGamification();

  const [selectedCategory, setSelectedCategory] = useState('total_points');

  useEffect(() => {
    loadLeaderboard(selectedCategory);
  }, [selectedCategory]);

  const handleRewardRedeem = async (reward: any) => {
    if (progress && progress.total_points >= reward.points_cost) {
      await redeemReward(reward);
    }
  };

  return (
    <div className="container-responsive py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-watt-gradient rounded-2xl mb-4 shadow-watt-glow">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-watt-gradient bg-clip-text text-transparent mb-2">
          Achievement Center
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Track your progress, unlock achievements, and compete with the community
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-watt-primary/10 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-watt-gradient rounded-full mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl">{progress?.total_points || 0}</h3>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>

        <Card className="border-watt-primary/10 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-watt-gradient rounded-full mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl">{progress?.current_level || 1}</h3>
            <p className="text-sm text-muted-foreground">Current Level</p>
          </CardContent>
        </Card>

        <Card className="border-watt-primary/10 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-watt-gradient rounded-full mx-auto mb-3">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl">{progress?.streak_days || 0}</h3>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="border-watt-primary/10 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-watt-gradient rounded-full mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-2xl">{achievements.length}</h3>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      {progress && (
        <Card className="border-watt-primary/10 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-watt-primary" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-watt-gradient">Level {progress.current_level}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {progress.experience_points} XP
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {getExperienceToNextLevel()} XP to next level
                </span>
              </div>
              <Progress 
                value={getProgressToNextLevel()} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-watt-primary/10 rounded-xl p-1 shadow-lg">
          <TabsTrigger 
            value="achievements" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white rounded-lg"
          >
            <Medal className="w-4 h-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white rounded-lg"
          >
            <Crown className="w-4 h-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rewards" 
            className="flex items-center space-x-2 data-[state=active]:bg-watt-gradient data-[state=active]:text-white rounded-lg"
          >
            <Gift className="w-4 h-4" />
            <span>Rewards</span>
          </TabsTrigger>
        </TabsList>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="border-watt-primary/10 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{achievement.badge_icon || '🏆'}</div>
                  <h3 className="font-bold text-lg mb-2">{achievement.achievement_name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-watt-gradient">
                      +{achievement.points_earned} XP
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {achievements.length === 0 && (
            <Card className="border-watt-primary/10 shadow-lg">
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold text-lg mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground">
                  Start using the platform to unlock your first achievements!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="border-watt-primary/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-watt-primary" />
                  Global Leaderboard
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === 'total_points' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('total_points')}
                    className={selectedCategory === 'total_points' ? 'bg-watt-gradient' : ''}
                  >
                    Points
                  </Button>
                  <Button
                    variant={selectedCategory === 'achievements' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('achievements')}
                    className={selectedCategory === 'achievements' ? 'bg-watt-gradient' : ''}
                  >
                    Achievements
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index < 3 ? 'bg-watt-gradient/10 border border-watt-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {index === 0 && <Crown className="w-6 h-6 text-yellow-500" />}
                        {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
                        {index === 2 && <Award className="w-6 h-6 text-amber-600" />}
                        {index > 2 && <span className="font-bold text-muted-foreground">#{index + 1}</span>}
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.profiles?.avatar_url} />
                        <AvatarFallback>
                          {entry.profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{entry.profiles?.full_name || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(entry.score)} {selectedCategory === 'total_points' ? 'points' : 'achievements'}
                        </p>
                      </div>
                      {index < 3 && (
                        <Badge className="bg-watt-gradient">
                          Top {index + 1}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="border-watt-primary/10 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Gift className="w-12 h-12 mx-auto mb-3 text-watt-primary" />
                    <h3 className="font-bold text-lg">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-watt-primary/30">
                      {reward.points_cost} points
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleRewardRedeem(reward)}
                      disabled={!progress || progress.total_points < reward.points_cost}
                      className="bg-watt-gradient hover:opacity-90"
                    >
                      Redeem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {availableRewards.length === 0 && (
            <Card className="border-watt-primary/10 shadow-lg">
              <CardContent className="p-12 text-center">
                <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold text-lg mb-2">No Rewards Available</h3>
                <p className="text-muted-foreground">
                  Check back later for new rewards to redeem!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};