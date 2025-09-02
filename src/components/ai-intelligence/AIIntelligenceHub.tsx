import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, BarChart, Target, Activity } from 'lucide-react';
import { PricePredictionDashboard } from './PricePredictionDashboard';
import { MarketIntelligenceDashboard } from './MarketIntelligenceDashboard';
import { InvestmentRecommendations } from './InvestmentRecommendations';

export function AIIntelligenceHub() {
  const [activeTab, setActiveTab] = useState('predictions');

  const features = [
    {
      icon: TrendingUp,
      title: 'Price Predictions',
      description: 'AI-powered energy price forecasting',
      badge: 'ML Powered',
      color: 'text-green-500'
    },
    {
      icon: BarChart,
      title: 'Market Intelligence',
      description: 'Comprehensive regional analysis',
      badge: 'AI Analysis',
      color: 'text-blue-500'
    },
    {
      icon: Target,
      title: 'Investment Recommendations',
      description: 'Personalized opportunity identification',
      badge: 'Personalized',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Intelligence Hub</h1>
              <p className="text-muted-foreground">Advanced AI-powered market analysis and predictions</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {features.map((feature, index) => (
              <Card key={`ai-tool-${feature.title}-${index}`} className="border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Price Predictions</span>
              <span className="sm:hidden">Predictions</span>
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span className="hidden sm:inline">Market Intelligence</span>
              <span className="sm:hidden">Intelligence</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Recommendations</span>
              <span className="sm:hidden">Invest</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            <PricePredictionDashboard />
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <MarketIntelligenceDashboard />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <InvestmentRecommendations />
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              AI Features Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-1">99%</div>
                <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-500 mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Energy Markets</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-500 mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Real-time Analysis</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-500 mb-1">1000+</div>
                <div className="text-sm text-muted-foreground">Data Sources</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}