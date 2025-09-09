import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketData {
  btcPrice: number;
  networkDifficulty: number;
  blockReward: number;
  avgBlockTime: number;
  lastUpdated: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching live market data...');
    
    // Fetch Bitcoin price from CoinGecko (free, no API key required)
    const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const btcData = await btcResponse.json();
    const btcPrice = btcData.bitcoin?.usd || 95000; // Fallback if API fails
    
    // Fetch network difficulty from blockchain.info
    const difficultyResponse = await fetch('https://blockchain.info/q/getdifficulty');
    const networkDifficulty = parseFloat(await difficultyResponse.text()) || 106.9e12;
    
    // Fetch latest block info for current block reward
    const blockResponse = await fetch('https://blockchain.info/latestblock');
    const blockData = await blockResponse.json();
    const blockHeight = blockData.height;
    
    // Calculate current block reward based on halving schedule
    let blockReward = 50; // Initial reward
    let halvings = Math.floor(blockHeight / 210000);
    for (let i = 0; i < halvings; i++) {
      blockReward /= 2;
    }
    
    // Get average block time from recent blocks
    const recentBlocksResponse = await fetch('https://blockchain.info/blocks?format=json');
    const recentBlocks = await recentBlocksResponse.json();
    
    let totalTime = 0;
    let blockCount = Math.min(10, recentBlocks.blocks.length - 1);
    
    for (let i = 0; i < blockCount; i++) {
      const timeDiff = recentBlocks.blocks[i].time - recentBlocks.blocks[i + 1].time;
      totalTime += timeDiff;
    }
    
    const avgBlockTime = blockCount > 0 ? totalTime / blockCount : 600; // Fallback to 10 minutes
    
    const marketData: MarketData = {
      btcPrice,
      networkDifficulty,
      blockReward,
      avgBlockTime,
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Market data fetched:', {
      btcPrice: `$${btcPrice.toLocaleString()}`,
      networkDifficulty: `${(networkDifficulty / 1e12).toFixed(1)}T`,
      blockReward,
      avgBlockTime: `${Math.round(avgBlockTime)}s`
    });

    return new Response(JSON.stringify(marketData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching market data:', error);
    
    // Return fallback data if all APIs fail
    const fallbackData: MarketData = {
      btcPrice: 95000,
      networkDifficulty: 106.9e12,
      blockReward: 6.25,
      avgBlockTime: 600,
      lastUpdated: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});