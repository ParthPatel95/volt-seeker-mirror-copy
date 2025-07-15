import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Battery, MapPin, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GridBazaar
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The premier marketplace for energy infrastructure and renewable energy assets
          </p>
          <Link to="/gridbazaar">
            <Button size="lg" className="text-lg px-8 py-6">
              Enter GridBazaar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <Battery className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Energy Infrastructure</CardTitle>
              <CardDescription>
                Discover and trade solar farms, wind projects, and energy storage facilities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Site Development</CardTitle>
              <CardDescription>
                Find prime locations for renewable energy development and infrastructure
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Equipment Trading</CardTitle>
              <CardDescription>
                Buy and sell renewable energy equipment from verified vendors
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
