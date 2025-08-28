import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

interface CryptoSymbol {
  id: number;
  symbol: string;
  created_at: string;
  order_index: number;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Initialize Supabase client
function getSupabase(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}

// GET /api/crypto-symbols - Fetch all crypto symbols
app.get('/api/crypto-symbols', async (c: Context<{ Bindings: Env }>) => {
  try {
    const supabase = getSupabase(c.env);
    
    const { data, error } = await supabase
      .from('crypto_symbols')
      .select('id, symbol, created_at, order_index')
      .order('order_index');

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching crypto symbols:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/crypto-symbols - Add new crypto symbol
app.post('/api/crypto-symbols', async (c: Context<{ Bindings: Env }>) => {
  try {
    const { symbol } = await c.req.json();
    
    if (!symbol || typeof symbol !== 'string') {
      return c.json({ error: 'Invalid symbol' }, 400);
    }

    const supabase = getSupabase(c.env);

    // Get current max order_index
    const { data: maxData } = await supabase
      .from('crypto_symbols')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrderIndex = maxData && maxData.length > 0 ? maxData[0].order_index + 1 : 0;

    // Insert new symbol
    const { data, error } = await supabase
      .from('crypto_symbols')
      .insert({
        symbol: symbol.toUpperCase(),
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    console.error('Error adding crypto symbol:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// DELETE /api/crypto-symbols/:id - Delete crypto symbol
app.delete('/api/crypto-symbols/:id', async (c: Context<{ Bindings: Env }>) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    if (isNaN(id)) {
      return c.json({ error: 'Invalid ID' }, 400);
    }

    const supabase = getSupabase(c.env);

    const { error } = await supabase
      .from('crypto_symbols')
      .delete()
      .eq('id', id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.body(null, 204);
  } catch (error) {
    console.error('Error deleting crypto symbol:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// PUT /api/crypto-symbols/reorder - Update symbol order
app.put('/api/crypto-symbols/reorder', async (c: Context<{ Bindings: Env }>) => {
  try {
    const { symbols } = await c.req.json() as { symbols: CryptoSymbol[] };
    
    if (!Array.isArray(symbols)) {
      return c.json({ error: 'Invalid symbols array' }, 400);
    }

    const supabase = getSupabase(c.env);

    // Update each symbol's order_index
    const updatePromises = symbols.map((symbol, index) =>
      supabase
        .from('crypto_symbols')
        .update({ order_index: index })
        .eq('id', symbol.id)
    );

    const results = await Promise.all(updatePromises);
    
    // Check for errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      return c.json({ error: 'Failed to reorder some symbols' }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error reordering symbols:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check endpoint
app.get('/health', (c: Context<{ Bindings: Env }>) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;