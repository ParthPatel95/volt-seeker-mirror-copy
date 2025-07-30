import React from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, TrendingUp } from 'lucide-react';

export const TrendingSidebar = () => {
  const { trendingHashtags } = useSocialNetwork();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-watt-primary" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingHashtags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No trending topics yet</p>
          ) : (
            trendingHashtags.map((hashtag, index) => (
              <div key={hashtag.id || index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-watt-primary" />
                  <span className="font-medium">#{hashtag.tag}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {hashtag.posts_count} posts
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};