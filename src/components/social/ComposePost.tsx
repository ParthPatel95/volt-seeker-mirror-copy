import React, { useState, useRef } from 'react';
import { useSocialNetwork } from '@/hooks/useSocialNetwork';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  X,
  Image,
  Smile,
  Hash,
  AtSign,
  MapPin,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ComposePostProps {
  onClose?: () => void;
  onPost?: () => void;
  compact?: boolean;
}

export const ComposePost = ({ onClose, onPost, compact = false }: ComposePostProps) => {
  const { createPost } = useSocialNetwork();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 280;
  const charactersUsed = content.length;
  const charactersRemaining = MAX_CHARS - charactersUsed;
  const isOverLimit = charactersUsed > MAX_CHARS;

  const extractHashtags = (text: string) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const extractMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(mention => mention.substring(1)) : [];
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHashtags(extractHashtags(value));
    setMentions(extractMentions(value));
  };

  const handlePost = async () => {
    if (!content.trim() || isOverLimit) return;

    setIsPosting(true);
    try {
      await createPost(content, null, hashtags, mentions);
      setContent('');
      setHashtags([]);
      setMentions([]);
      onPost?.();
      onClose?.();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const [currentUser, setCurrentUser] = useState<any>(null);
  
  React.useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  if (compact) {
    return (
      <Card className="p-4 border-0 border-b rounded-none">
        <div className="flex space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {currentUser?.user_metadata?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              placeholder="What's happening in the energy world?"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[80px] border-0 text-lg placeholder:text-muted-foreground resize-none focus-visible:ring-0"
              maxLength={MAX_CHARS + 50} // Allow slight overrun for warning
            />
            
            {(hashtags.length > 0 || mentions.length > 0) && (
              <div className="flex flex-wrap gap-1 mt-2">
                {hashtags.map((tag, index) => (
                  <Badge key={`hashtag-${index}`} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {mentions.map((mention, index) => (
                  <Badge key={`mention-${index}`} variant="outline" className="text-xs">
                    @{mention}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-watt-primary">
                  <Image className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-watt-primary">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-watt-primary">
                  <Hash className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-watt-primary">
                  <AtSign className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {charactersUsed > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="relative w-6 h-6">
                      <Progress 
                        value={(charactersUsed / MAX_CHARS) * 100} 
                        className="w-6 h-6 rounded-full"
                      />
                      {isOverLimit && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500 font-bold">
                          {Math.abs(charactersRemaining)}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {charactersRemaining}
                    </span>
                  </div>
                )}
                
                <Button
                  onClick={handlePost}
                  disabled={!content.trim() || isOverLimit || isPosting}
                  className="bg-watt-gradient hover:opacity-90 disabled:opacity-50"
                  size="sm"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Compose Post</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Compose Area */}
      <div className="flex space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {currentUser?.user_metadata?.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="What's happening in the energy world?"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[120px] text-lg placeholder:text-muted-foreground border-0 focus-visible:ring-0 resize-none"
            maxLength={MAX_CHARS + 50}
          />

          {(hashtags.length > 0 || mentions.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {hashtags.map((tag, index) => (
                <Badge key={`hashtag-${index}`} variant="secondary">
                  #{tag}
                </Badge>
              ))}
              {mentions.map((mention, index) => (
                <Badge key={`mention-${index}`} variant="outline">
                  @{mention}
                </Badge>
              ))}
            </div>
          )}

          {/* Tools */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-watt-primary">
                <Image className="w-5 h-5 mr-2" />
                Media
              </Button>
              <Button variant="ghost" size="sm" className="text-watt-primary">
                <Smile className="w-5 h-5 mr-2" />
                Emoji
              </Button>
              <Button variant="ghost" size="sm" className="text-watt-primary">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {charactersUsed > 0 && (
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={(charactersUsed / MAX_CHARS) * 100} 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {charactersRemaining}
                  </span>
                </div>
              )}
              
              <Button
                onClick={handlePost}
                disabled={!content.trim() || isOverLimit || isPosting}
                className="bg-watt-gradient hover:opacity-90 disabled:opacity-50"
              >
                {isPosting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};