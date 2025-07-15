import React from 'react';

const LandingNavigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">VoltMarket</div>
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="text-muted-foreground hover:text-foreground">About</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavigation;