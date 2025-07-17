import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, TrendingUp, Shield, ArrowRight, Zap } from 'lucide-react';

export const VoltMarketHomepage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20">
        <Badge className="mb-6 bg-watt-primary/10 text-watt-primary border-watt-primary/20">
          <Zap className="w-4 h-4 mr-2" />
          Global Energy Infrastructure Marketplace
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-gray-900">GridBazaar</span>
          <br />
          <span className="text-watt-primary">Energy Infrastructure</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          The world's most advanced energy infrastructure marketplace with real-time analytics and AI-powered insights.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/voltmarket/auth">
            <Button size="lg" className="bg-watt-gradient hover:opacity-90 px-8 py-4">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/voltmarket/auth">
            <Button size="lg" variant="outline" className="border-2 border-watt-primary text-watt-primary px-8 py-4">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose GridBazaar</h2>
          <p className="text-xl text-gray-600">Built specifically for energy infrastructure professionals</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Building2,
              title: "Asset Listings",
              description: "Browse energy infrastructure assets worldwide"
            },
            {
              icon: Users,
              title: "Verified Users",
              description: "Connect with verified energy professionals"
            },
            {
              icon: TrendingUp,
              title: "Market Analytics",
              description: "Real-time market data and insights"
            },
            {
              icon: Shield,
              title: "Secure Platform",
              description: "Enterprise-grade security and compliance"
            }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-watt-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};