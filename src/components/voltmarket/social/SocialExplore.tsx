import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Building, Users, Hash, Zap, Star, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SocialExplore = () => {
  const [trendingHashtags, setTrendingHashtags] = useState([
    { tag: '#SolarEnergy', posts: 42, growth: '+12%' },
    { tag: '#WindPower', posts: 38, growth: '+8%' },
    { tag: '#EnergyInfrastructure', posts: 35, growth: '+15%' },
    { tag: '#BitcoinMining', posts: 29, growth: '+22%' },
    { tag: '#RenewableEnergy', posts: 25, growth: '+5%' },
    { tag: '#GridModernization', posts: 22, growth: '+18%' },
    { tag: '#EnergyStorage', posts: 19, growth: '+25%' },
    { tag: '#DataCenters', posts: 17, growth: '+10%' }
  ]);

  const [suggestedCompanies, setSuggestedCompanies] = useState([
    { name: 'SolarTech Solutions', role: 'Solar Developer', followers: 1200, verified: true },
    { name: 'WindFlow Energy', role: 'Wind Farm Operator', followers: 980, verified: true },
    { name: 'GridConnect Inc', role: 'Grid Infrastructure', followers: 756, verified: false },
    { name: 'PowerScale Mining', role: 'Mining Operations', followers: 643, verified: true }
  ]);

  const [industryTopics, setIndustryTopics] = useState([
    { title: 'Energy Market Updates', posts: 156, trend: 'up' },
    { title: 'Solar Development News', posts: 134, trend: 'up' },
    { title: 'Wind Power Projects', posts: 112, trend: 'stable' },
    { title: 'Grid Infrastructure', posts: 98, trend: 'up' },
    { title: 'Energy Storage Solutions', posts: 87, trend: 'up' },
    { title: 'Renewable Policy Updates', posts: 76, trend: 'down' }
  ]);

  const [marketInsights, setMarketInsights] = useState([
    { title: 'Solar Capacity Growth', value: '+34%', description: 'YoY installation increase', icon: '☀️' },
    { title: 'Wind Projects', value: '284', description: 'Active developments', icon: '💨' },
    { title: 'Grid Investment', value: '$12.4B', description: 'Committed capital', icon: '⚡' },
    { title: 'Energy Storage', value: '45 GWh', description: 'Planned capacity', icon: '🔋' }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-watt-success" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-watt-warning rotate-180" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-muted" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Market Insights Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {marketInsights.map((insight, index) => (
          <Card key={index} className="border border-watt-primary/10 bg-gradient-to-br from-card to-watt-light/5 hover:shadow-watt-glow/20 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{insight.icon}</span>
                <TrendingUp className="w-4 h-4 text-watt-success" />
              </div>
              <div className="text-2xl font-bold text-watt-primary">
                {insight.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trending Hashtags */}
        <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-watt-gradient flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
              <span>Trending Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingHashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-watt-primary/5 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-watt-primary group-hover:text-watt-secondary transition-colors">
                    {hashtag.tag}
                  </span>
                  <Badge variant="outline" className="text-xs bg-watt-success/10 text-watt-success border-watt-success/20">
                    {hashtag.growth}
                  </Badge>
                </div>
                <Badge variant="secondary" className="text-xs bg-watt-primary/10 text-watt-primary">
                  {hashtag.posts}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Companies */}
        <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-watt-gradient flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <span>Companies to Follow</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-watt-primary/5 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-watt-gradient flex items-center justify-center shadow-md">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold">{company.name}</p>
                      {company.verified && (
                        <Star className="w-3 h-3 text-watt-accent fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{company.role}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {company.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement follow functionality
                    console.log('Following:', company.name);
                  }}
                  className="border-watt-primary/20 text-watt-primary hover:bg-watt-primary hover:text-white transition-all"
                >
                  Follow
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Industry Topics */}
        <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-watt-gradient flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span>Hot Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {industryTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-watt-primary/5 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium group-hover:text-watt-primary transition-colors">
                    {topic.title}
                  </span>
                  {getTrendIcon(topic.trend)}
                </div>
                <Badge variant="outline" className="text-xs bg-watt-secondary/10 text-watt-secondary border-watt-secondary/20">
                  {topic.posts}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Featured Energy Regions */}
      <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-watt-gradient flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>Featured Energy Regions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { region: 'Texas Grid (ERCOT)', activity: 'High', projects: 156 },
              { region: 'California ISO', activity: 'Very High', projects: 203 },
              { region: 'PJM Interconnection', activity: 'Medium', projects: 89 },
              { region: 'Midwest ISO', activity: 'High', projects: 127 }
            ].map((region, index) => (
              <div key={index} className="p-4 rounded-lg border border-watt-primary/10 hover:bg-watt-primary/5 transition-colors">
                <h4 className="font-semibold text-sm mb-2">{region.region}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Activity</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      region.activity === 'Very High' ? 'bg-watt-success/10 text-watt-success' :
                      region.activity === 'High' ? 'bg-watt-warning/10 text-watt-warning' :
                      'bg-watt-primary/10 text-watt-primary'
                    }`}
                  >
                    {region.activity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{region.projects} active projects</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};