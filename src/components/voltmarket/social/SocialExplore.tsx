import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Building, Users, Hash } from 'lucide-react';

export const SocialExplore = () => {
  const trendingHashtags = [
    { tag: '#SolarEnergy', posts: 42 },
    { tag: '#WindPower', posts: 38 },
    { tag: '#EnergyInfrastructure', posts: 35 },
    { tag: '#BitcoinMining', posts: 29 },
    { tag: '#RenewableEnergy', posts: 25 },
    { tag: '#GridModernization', posts: 22 },
    { tag: '#EnergyStorage', posts: 19 },
    { tag: '#DataCenters', posts: 17 }
  ];

  const suggestedCompanies = [
    { name: 'SolarTech Solutions', role: 'Solar Developer', followers: 1200 },
    { name: 'WindFlow Energy', role: 'Wind Farm Operator', followers: 980 },
    { name: 'GridConnect Inc', role: 'Grid Infrastructure', followers: 756 },
    { name: 'PowerScale Mining', role: 'Mining Operations', followers: 643 }
  ];

  const industryTopics = [
    { title: 'Energy Market Updates', posts: 156 },
    { title: 'Solar Development News', posts: 134 },
    { title: 'Wind Power Projects', posts: 112 },
    { title: 'Grid Infrastructure', posts: 98 },
    { title: 'Energy Storage Solutions', posts: 87 },
    { title: 'Renewable Policy Updates', posts: 76 }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Trending Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-primary" />
            <span>Trending Tags</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingHashtags.map((hashtag, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary cursor-pointer hover:underline">
                {hashtag.tag}
              </span>
              <Badge variant="secondary" className="text-xs">
                {hashtag.posts}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-primary" />
            <span>Companies to Follow</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedCompanies.map((company, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{company.followers}</p>
                <p className="text-xs text-muted-foreground">followers</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Industry Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Hot Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {industryTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium cursor-pointer hover:text-primary">
                {topic.title}
              </span>
              <Badge variant="outline" className="text-xs">
                {topic.posts}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};