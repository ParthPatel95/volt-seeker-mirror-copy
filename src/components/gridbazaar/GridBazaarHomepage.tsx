import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Battery, 
  MapPin, 
  TrendingUp, 
  Users, 
  Zap, 
  Wind,
  ArrowRight
} from 'lucide-react';

const featuredListings = [
  {
    id: 1,
    title: "500MW Solar Farm - Texas",
    type: "Solar",
    price: "$125M",
    location: "Austin, TX",
    capacity: "500MW",
    status: "Active"
  },
  {
    id: 2,
    title: "Wind Project Development Site",
    type: "Wind",
    price: "$89M",
    location: "Oklahoma",
    capacity: "300MW",
    status: "Planning"
  },
  {
    id: 3,
    title: "Battery Storage Facility",
    type: "Storage",
    price: "$45M",
    location: "California",
    capacity: "100MWh",
    status: "Active"
  }
];

const marketStats = [
  { label: "Active Listings", value: "2,847", icon: TrendingUp },
  { label: "Total Capacity", value: "15.2 GW", icon: Zap },
  { label: "Verified Sellers", value: "1,234", icon: Users },
  { label: "Projects Sold", value: "892", icon: Battery }
];

export const GridBazaarHomepage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          The Premier Energy Infrastructure Marketplace
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with verified buyers and sellers of renewable energy projects, 
          development sites, and equipment worldwide.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/gridbazaar/listings">
            <Button size="lg">
              Browse Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/gridbazaar/auth">
            <Button variant="outline" size="lg">
              Start Selling
            </Button>
          </Link>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center p-6">
              <stat.icon className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Listings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Listings</h2>
          <Link to="/gridbazaar/listings">
            <Button variant="outline">View All Listings</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">{listing.type}</Badge>
                  <Badge 
                    variant={listing.status === 'Active' ? 'default' : 'outline'}
                  >
                    {listing.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{listing.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold">{listing.capacity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-bold text-primary">{listing.price}</p>
                  </div>
                </div>
                <Link to={`/gridbazaar/listings/${listing.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Battery className="h-12 w-12 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Solar Projects</h3>
                <p className="text-muted-foreground">Solar farms and installations</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Wind className="h-12 w-12 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Wind Projects</h3>
                <p className="text-muted-foreground">Wind farms and turbines</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Zap className="h-12 w-12 text-primary mr-4" />
              <div>
                <h3 className="font-semibold">Energy Storage</h3>
                <p className="text-muted-foreground">Battery and storage systems</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};