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
    
    // Fetch Bitcoin price from multiple reliable sources
    let btcPrice = 95000; // Fallback
    
    try {
      // Try CoinMarketCap first (more reliable)
      const cmcResponse = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC', {
        headers: {
          'X-CMC_PRO_API_KEY': Deno.env.get('COINMARKETCAP_API_KEY') || '',
          'Accept': 'application/json'
        }
      });
      
      if (cmcResponse.ok) {
        const cmcData = await cmcResponse.json();
        if (cmcData.data?.BTC?.quote?.USD?.price) {
          btcPrice = cmcData.data.BTC.quote.USD.price;
          console.log('Using CoinMarketCap BTC price:', btcPrice);
        }
      } else {
        throw new Error('CoinMarketCap failed');
      }
    } catch (error) {
      console.log('CoinMarketCap failed, trying CoinGecko:', error);
      // Fallback to CoinGecko
      try {
        const cgResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const cgData = await cgResponse.json();
        if (cgData.bitcoin?.usd) {
          btcPrice = cgData.bitcoin.usd;
          console.log('Using CoinGecko BTC price:', btcPrice);
        }
      } catch (cgError) {
        console.log('CoinGecko also failed, using fallback price:', cgError);
      }
    }
    
    // Fetch network difficulty with error handling
    let networkDifficulty = 106.9e12; // Fallback
    try {
      const difficultyResponse = await fetch('https://blockchain.info/q/getdifficulty');
      if (difficultyResponse.ok) {
        const diffText = await difficultyResponse.text();
        const parsedDifficulty = parseFloat(diffText);
        if (!isNaN(parsedDifficulty)) {
          networkDifficulty = parsedDifficulty;
        }
      }
    } catch (error) {
      console.log('Failed to fetch difficulty, using fallback:', error);
    }
    
    // Calculate current block reward based on current block height
    let blockReward = 6.25; // Current post-halving reward
    let blockHeight = 870000; // Approximate current height
    
    try {
      const blockResponse = await fetch('https://blockchain.info/latestblock');
      if (blockResponse.ok) {
        const blockData = await blockResponse.json();
        if (blockData.height) {
          blockHeight = blockData.height;
          // Calculate reward based on halvings
          blockReward = 50; // Initial reward
          const halvings = Math.floor(blockHeight / 210000);
          for (let i = 0; i < halvings; i++) {
            blockReward /= 2;
          }
        }
      }
    } catch (error) {
      console.log('Failed to fetch block height, using current reward:', error);
    }
    
    // Use a fixed average block time of 10 minutes (600 seconds)
    const avgBlockTime = 600;
    
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