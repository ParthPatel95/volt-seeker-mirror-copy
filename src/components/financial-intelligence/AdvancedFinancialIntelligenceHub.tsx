import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, BarChart3, Calculator, Activity, DollarSign } from 'lucide-react';
import { RiskAssessmentDashboard } from './RiskAssessmentDashboard';

export function AdvancedFinancialIntelligenceHub() {
  const [activeTab, setActiveTab] = useState('risk-assessment');

  const features = [
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Real-time risk analysis with ML',
      badge: 'AI Powered',
      color: 'text-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Portfolio Optimization',
      description: 'AI-driven asset allocation',
      badge: 'ML Enhanced',
      color: 'text-green-500'
    },
    {
      icon: BarChart3,
      title: 'Market Sentiment',
      description: 'News & social media analysis',
      badge: 'Real-time',
      color: 'text-blue-500'
    },
    {
      icon: Calculator,
      title: 'Property Valuation',
      description: 'Automated valuation models',
      badge: 'AVM',
      color: 'text-purple-500'
    },
    {
      icon: Activity,
      title: 'Stress Testing',
      description: 'Scenario-based risk modeling',
      badge: 'Advanced',
      color: 'text-orange-500'
    }
  ];

  const mockPortfolioData = {
    total_value: 4250000,
    ytd_return: 12.4,
    risk_score: 34,
    sharpe_ratio: 1.23
  };

  const mockMarketData = [
    { segment: 'Energy Infrastructure', sentiment: 67, trend: 'positive' },
    { segment: 'Renewable Projects', sentiment: 82, trend: 'very_positive' },
    { segment: 'Traditional Energy', sentiment: 31, trend: 'negative' },
    { segment: 'Grid Modernization', sentiment: 74, trend: 'positive' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Advanced Financial Intelligence</h1>
              <p className="text-muted-foreground">AI-powered financial analysis and risk management</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
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

          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${(mockPortfolioData.total_value / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-green-500">
                  +{mockPortfolioData.ytd_return}% YTD
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {mockPortfolioData.risk_score}%
                </div>
                <div className="text-sm text-muted-foreground">Low Risk</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {mockPortfolioData.sharpe_ratio}
                </div>
                <div className="text-sm text-muted-foreground">Excellent</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Positive</div>
                <div className="text-sm text-muted-foreground">+15 pts</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="risk-assessment" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Risk Assessment</span>
              <span className="sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Portfolio</span>
              <span className="sm:hidden">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Sentiment</span>
              <span className="sm:hidden">Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="valuation" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Valuation</span>
              <span className="sm:hidden">Value</span>
            </TabsTrigger>
            <TabsTrigger value="stress-test" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Stress Test</span>
              <span className="sm:hidden">Test</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="risk-assessment" className="space-y-6">
            <RiskAssessmentDashboard />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Portfolio Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Portfolio Optimizer
                  </h3>
                  <p className="text-muted-foreground">
                    AI-powered portfolio optimization and rebalancing recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Market Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockMarketData.map((market, index) => (
                    <Card key={index} className="border-0 bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{market.segment}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {market.trend.replace('_', ' ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">
                              {market.sentiment}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Sentiment Score
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="valuation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-500" />
                  Automated Property Valuation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Property Valuation Models
                  </h3>
                  <p className="text-muted-foreground">
                    AI-powered automated valuation using multiple methodologies
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stress-test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Financial Stress Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Scenario-Based Stress Testing
                  </h3>
                  <p className="text-muted-foreground">
                    Comprehensive stress testing with multiple economic scenarios
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Financial Intelligence Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-500 mb-1">98.7%</div>
                <div className="text-sm text-muted-foreground">Risk Model Accuracy</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-500 mb-1">15.2%</div>
                <div className="text-sm text-muted-foreground">Avg Portfolio Improvement</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-500 mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Real-time Monitoring</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-orange-500 mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Financial Models</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}