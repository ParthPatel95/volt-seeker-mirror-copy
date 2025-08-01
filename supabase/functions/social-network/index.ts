import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data } = await req.json();
    console.log(`Social network action: ${action}`, data);

    switch (action) {
      case 'create_post':
        return await createPost(supabaseClient, data);
      case 'get_feed':
        return await getFeed(supabaseClient, data);
      case 'like_post':
        return await likePost(supabaseClient, data);
      case 'unlike_post':
        return await unlikePost(supabaseClient, data);
      case 'repost':
        return await repostPost(supabaseClient, data);
      case 'follow_user':
        return await followUser(supabaseClient, data);
      case 'unfollow_user':
        return await unfollowUser(supabaseClient, data);
      case 'create_comment':
        return await createComment(supabaseClient, data);
      case 'get_comments':
        return await getComments(supabaseClient, data);
      case 'search_posts':
        return await searchPosts(supabaseClient, data);
      case 'get_trending_hashtags':
        return await getTrendingHashtags(supabaseClient, data);
      case 'get_user_profile':
        return await getUserProfile(supabaseClient, data);
      case 'update_profile':
        return await updateProfile(supabaseClient, data);
      case 'get_notifications':
        return await getNotifications(supabaseClient, data);
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in social-network function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function createPost(supabase: any, data: any) {
  const { user_id, content, attachments, hashtags, mentions } = data;
  
  // Create the post
  const { data: post, error } = await supabase
    .from('social_posts')
    .insert({
      user_id,
      content,
      attachments: attachments || null,
      hashtags: hashtags || [],
      mentions: mentions || [],
      post_type: 'post'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Update hashtag counts
  if (hashtags && hashtags.length > 0) {
    for (const tag of hashtags) {
      await supabase
        .from('social_hashtags')
        .upsert({
          tag: tag.replace('#', ''),
          posts_count: 1
        }, {
          onConflict: 'tag'
        });
    }
  }

  return new Response(
    JSON.stringify({ success: true, post }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getFeed(supabase: any, data: any) {
  const { user_id, limit = 20, offset = 0 } = data;

  // Get posts from followed users + user's own posts
  const { data: posts, error } = await supabase
    .from('social_posts')
    .select(`
      *,
      social_post_likes!left(user_id),
      social_reposts!left(user_id)
    `)
    .or(`user_id.eq.${user_id},user_id.in.(select following_id from social_follows where follower_id = ${user_id})`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error getting feed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get user info for posts by joining with gridbazaar_profiles
  const postsWithUserInfo = await Promise.all(posts.map(async (post: any) => {
    const { data: userProfile } = await supabase
      .from('gridbazaar_profiles')
      .select('company_name, profile_image_url')
      .eq('user_id', post.user_id)
      .single();
    
    return {
      ...post,
      user_name: userProfile?.company_name || 'Unknown User',
      user_avatar: userProfile?.profile_image_url || null,
      is_liked: post.social_post_likes?.some((like: any) => like.user_id === user_id) || false,
      is_reposted: post.social_reposts?.some((repost: any) => repost.user_id === user_id) || false
    };
  }));

  return new Response(
    JSON.stringify({ success: true, posts: postsWithUserInfo }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function likePost(supabase: any, data: any) {
  const { user_id, post_id } = data;

  const { error } = await supabase
    .from('social_post_likes')
    .insert({ user_id, post_id });

  if (error) {
    console.error('Error liking post:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Create notification
  const { data: post } = await supabase
    .from('social_posts')
    .select('user_id')
    .eq('id', post_id)
    .single();

  if (post && post.user_id !== user_id) {
    await supabase
      .from('social_notifications')
      .insert({
        user_id: post.user_id,
        from_user_id: user_id,
        type: 'like',
        post_id,
        content: 'liked your post'
      });
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function unlikePost(supabase: any, data: any) {
  const { user_id, post_id } = data;

  const { error } = await supabase
    .from('social_post_likes')
    .delete()
    .eq('user_id', user_id)
    .eq('post_id', post_id);

  if (error) {
    console.error('Error unliking post:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function repostPost(supabase: any, data: any) {
  const { user_id, post_id, comment } = data;

  const { error } = await supabase
    .from('social_reposts')
    .insert({ user_id, post_id, comment });

  if (error) {
    console.error('Error reposting:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Create notification
  const { data: post } = await supabase
    .from('social_posts')
    .select('user_id')
    .eq('id', post_id)
    .single();

  if (post && post.user_id !== user_id) {
    await supabase
      .from('social_notifications')
      .insert({
        user_id: post.user_id,
        from_user_id: user_id,
        type: 'repost',
        post_id,
        content: comment ? `reposted with comment: "${comment}"` : 'reposted your post'
      });
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function followUser(supabase: any, data: any) {
  const { follower_id, following_id } = data;

  const { error } = await supabase
    .from('social_follows')
    .insert({ follower_id, following_id });

  if (error) {
    console.error('Error following user:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Create notification
  await supabase
    .from('social_notifications')
    .insert({
      user_id: following_id,
      from_user_id: follower_id,
      type: 'follow',
      content: 'started following you'
    });

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function unfollowUser(supabase: any, data: any) {
  const { follower_id, following_id } = data;

  const { error } = await supabase
    .from('social_follows')
    .delete()
    .eq('follower_id', follower_id)
    .eq('following_id', following_id);

  if (error) {
    console.error('Error unfollowing user:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createComment(supabase: any, data: any) {
  const { user_id, post_id, content, parent_comment_id } = data;

  const { data: comment, error } = await supabase
    .from('social_comments')
    .insert({
      user_id,
      post_id,
      content,
      parent_comment_id
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Create notification
  const { data: post } = await supabase
    .from('social_posts')
    .select('user_id')
    .eq('id', post_id)
    .single();

  if (post && post.user_id !== user_id) {
    await supabase
      .from('social_notifications')
      .insert({
        user_id: post.user_id,
        from_user_id: user_id,
        type: 'reply',
        post_id,
        comment_id: comment.id,
        content: `replied to your post: "${content.substring(0, 50)}..."`
      });
  }

  return new Response(
    JSON.stringify({ success: true, comment }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getComments(supabase: any, data: any) {
  const { post_id, limit = 10, offset = 0 } = data;

  const { data: comments, error } = await supabase
    .from('social_comments')
    .select(`
      *,
      profiles!social_comments_user_id_fkey(full_name, avatar_url),
      social_profiles(username, display_name, avatar_url, verified)
    `)
    .eq('post_id', post_id)
    .is('parent_comment_id', null)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error getting comments:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, comments }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function searchPosts(supabase: any, data: any) {
  const { query, user_id, limit = 20 } = data;

  const { data: posts, error } = await supabase
    .from('social_posts')
    .select(`
      *,
      profiles!social_posts_user_id_fkey(full_name, avatar_url),
      social_profiles(username, display_name, avatar_url, verified)
    `)
    .or(`content.ilike.%${query}%,hashtags.cs.{${query}}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error searching posts:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, posts }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getTrendingHashtags(supabase: any, data: any) {
  const { limit = 10 } = data;

  const { data: hashtags, error } = await supabase
    .from('social_hashtags')
    .select('*')
    .order('posts_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting trending hashtags:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, hashtags }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getUserProfile(supabase: any, data: any) {
  const { user_id, current_user_id } = data;

  const { data: profile, error } = await supabase
    .from('social_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error) {
    console.error('Error getting user profile:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Check if current user follows this profile
  let is_following = false;
  if (current_user_id && current_user_id !== user_id) {
    const { data: follow } = await supabase
      .from('social_follows')
      .select('id')
      .eq('follower_id', current_user_id)
      .eq('following_id', user_id)
      .single();
    
    is_following = !!follow;
  }

  // Get user's recent posts
  const { data: posts } = await supabase
    .from('social_posts')
    .select(`
      *,
      profiles!social_posts_user_id_fkey(full_name, avatar_url),
      social_profiles(username, display_name, avatar_url, verified)
    `)
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(10);

  return new Response(
    JSON.stringify({ 
      success: true, 
      profile: { ...profile, is_following },
      posts: posts || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateProfile(supabase: any, data: any) {
  const { user_id, username, display_name, bio, avatar_url, header_url, location, website } = data;

  const { data: profile, error } = await supabase
    .from('social_profiles')
    .upsert({
      user_id,
      username,
      display_name,
      bio,
      avatar_url,
      header_url,
      location,
      website
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, profile }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getNotifications(supabase: any, data: any) {
  const { user_id, limit = 20, offset = 0 } = data;

  const { data: notifications, error } = await supabase
    .from('social_notifications')
    .select(`
      *,
      post:social_posts(id, content)
    `)
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error getting notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get user info for notifications by joining with gridbazaar_profiles
  const notificationsWithUserInfo = await Promise.all(notifications.map(async (notification: any) => {
    const { data: userProfile } = await supabase
      .from('gridbazaar_profiles')
      .select('company_name, profile_image_url')
      .eq('user_id', notification.from_user_id)
      .single();
    
    return {
      ...notification,
      from_user_name: userProfile?.company_name || 'Unknown User',
      from_user_avatar: userProfile?.profile_image_url || null
    };
  }));

  return new Response(
    JSON.stringify({ success: true, notifications: notificationsWithUserInfo }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}