import React, { useState } from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { PostCard } from './PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const SocialSearch = () => {
  const { searchPosts } = useSocialNetwork();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchResults = await searchPosts(query);
      setResults(searchResults || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-4">
        <h2 className="text-xl font-bold mb-4">Search</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-0">
        {results.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
        {results.length === 0 && query && !loading && (
          <div className="p-8 text-center text-muted-foreground">
            No posts found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
};