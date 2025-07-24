import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Users, Star, Zap, TrendingUp } from 'lucide-react';
import { useParams } from 'react-router-dom';

export const CompanyProfile = () => {
  const { companyId } = useParams();

  // Mock company data - in real app, fetch from API
  const company = {
    name: 'SolarTech Solutions',
    role: 'Solar Developer',
    bio: 'Leading solar energy infrastructure developer with 10+ years of experience in utility-scale projects.',
    location: 'Austin, Texas',
    verified: true,
    followers: 1250,
    following: 320,
    posts: 89,
    joinedDate: '2019',
    website: 'https://solartech.example.com',
    projects: [
      { name: 'Texas Solar Farm', capacity: '150 MW', status: 'Operational' },
      { name: 'Arizona Grid Project', capacity: '200 MW', status: 'Under Construction' },
      { name: 'Nevada Storage Facility', capacity: '50 MWh', status: 'Planning' }
    ]
  };

  return (
    <div className="container-responsive py-6 animate-fade-in">
      {/* Company Header */}
      <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg mb-6">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 rounded-2xl bg-watt-gradient flex items-center justify-center shadow-lg">
              <Building className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                {company.verified && (
                  <Star className="w-6 h-6 text-watt-accent fill-current" />
                )}
              </div>
              
              <p className="text-watt-primary font-medium mb-2">{company.role}</p>
              <p className="text-muted-foreground mb-4">{company.bio}</p>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {company.location}
                </span>
                <span>Joined {company.joinedDate}</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-watt-primary">{company.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-watt-secondary">{company.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-watt-accent">{company.posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button className="bg-watt-gradient hover:opacity-90 text-white shadow-md">
                <Users className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" className="border-watt-primary/20">
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-watt-primary" />
                <span>Active Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.projects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-watt-primary/10 hover:bg-watt-primary/5 transition-colors">
                  <div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.capacity}</p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`${
                      project.status === 'Operational' ? 'bg-watt-success/10 text-watt-success' :
                      project.status === 'Under Construction' ? 'bg-watt-warning/10 text-watt-warning' :
                      'bg-watt-primary/10 text-watt-primary'
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-watt-primary/10 bg-gradient-to-br from-card to-card/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-watt-primary" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Posted about renewable energy trends</p>
                <p className="text-muted-foreground">Shared market analysis</p>
                <p className="text-muted-foreground">Announced new project milestone</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};