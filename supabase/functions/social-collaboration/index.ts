import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { action, data } = await req.json();

    console.log('Social collaboration action:', action);

    switch (action) {
      case 'create_post':
        return await createPost(supabase, data);
      case 'get_feed':
        return await getFeed(supabase, data);
      case 'interact_with_post':
        return await interactWithPost(supabase, data);
      case 'send_message':
        return await sendMessage(supabase, data);
      case 'get_messages':
        return await getMessages(supabase, data);
      case 'create_channel':
        return await createChannel(supabase, data);
      case 'join_channel':
        return await joinChannel(supabase, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Social collaboration error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process social collaboration request'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function createPost(supabase: any, data: any) {
  const { user_id, content, post_type, attachments, visibility, tags } = data;

  const { data: post, error } = await supabase
    .from('social_posts')
    .insert({
      user_id,
      content,
      post_type,
      attachments,
      visibility,
      tags
    })
    .select()
    .single();

  if (error) throw error;

  // Award points for creating content
  await updateUserProgress(supabase, user_id, 'post_created', 10);

  return new Response(
    JSON.stringify({ success: true, post }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getFeed(supabase: any, data: any) {
  const { user_id, post_type, limit = 20, offset = 0 } = data;

  // Since social_posts table doesn't exist yet, return empty feed for now
  // This prevents the edge function from crashing
  console.log('Social posts functionality not yet implemented - returning empty feed');
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      posts: [],
      message: 'Social posts functionality coming soon'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function interactWithPost(supabase: any, data: any) {
  const { user_id, target_id, interaction_type, content } = data;

  const { data: interaction, error } = await supabase
    .from('social_interactions')
    .insert({
      user_id,
      target_id,
      target_type: 'post',
      interaction_type,
      content
    })
    .select()
    .single();

  if (error) throw error;

  // Update post counters
  if (interaction_type === 'like') {
    await supabase.rpc('increment', {
      table_name: 'social_posts',
      row_id: target_id,
      column_name: 'likes_count'
    });
  }

  // Award points for engagement
  await updateUserProgress(supabase, user_id, 'social_interaction', 2);

  return new Response(
    JSON.stringify({ success: true, interaction }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function sendMessage(supabase: any, data: any) {
  const { sender_id, recipient_id, channel_id, content, message_type, attachments } = data;

  const { data: message, error } = await supabase
    .from('real_time_messages')
    .insert({
      sender_id,
      recipient_id,
      channel_id,
      content,
      message_type,
      attachments
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getMessages(supabase: any, data: any) {
  const { user_id, channel_id, recipient_id, limit = 50 } = data;

  let query = supabase
    .from('real_time_messages')
    .select(`
      *,
      sender:gridbazaar_profiles!real_time_messages_sender_id_fkey(company_name, profile_image_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (channel_id) {
    query = query.eq('channel_id', channel_id);
  } else if (recipient_id) {
    query = query.or(`sender_id.eq.${user_id},recipient_id.eq.${user_id}`)
                 .or(`sender_id.eq.${recipient_id},recipient_id.eq.${recipient_id}`);
  }

  const { data: messages, error } = await query;

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, messages }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createChannel(supabase: any, data: any) {
  const { name, description, channel_type, created_by } = data;

  const { data: channel, error } = await supabase
    .from('collaboration_channels')
    .insert({
      name,
      description,
      channel_type,
      created_by
    })
    .select()
    .single();

  if (error) throw error;

  // Auto-join creator to channel
  await supabase
    .from('channel_members')
    .insert({
      channel_id: channel.id,
      user_id: created_by,
      role: 'admin'
    });

  return new Response(
    JSON.stringify({ success: true, channel }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function joinChannel(supabase: any, data: any) {
  const { channel_id, user_id, role = 'member' } = data;

  const { data: membership, error } = await supabase
    .from('channel_members')
    .insert({
      channel_id,
      user_id,
      role
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, membership }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateUserProgress(supabase: any, user_id: string, action_type: string, points: number) {
  // Update or create user progress
  const { error } = await supabase.rpc('update_user_progress', {
    p_user_id: user_id,
    p_action_type: action_type,
    p_points: points
  });

  if (error) {
    console.error('Failed to update user progress:', error);
  }
}