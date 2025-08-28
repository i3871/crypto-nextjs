# Crypto Next.js Cloudflare Worker API

This Cloudflare Worker acts as a secure API proxy for Supabase operations, keeping API keys server-side.

## Setup

1. **Install dependencies:**
   ```bash
   cd cloudflare-worker
   npm install
   ```

2. **Set environment variables:**
   ```bash
   wrangler secret put SUPABASE_URL
   # Enter your Supabase URL: https://xxx.supabase.co

   wrangler secret put SUPABASE_ANON_KEY  
   # Enter your Supabase anon key
   ```

3. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

## API Endpoints

### GET /api/crypto-symbols
Fetch all crypto symbols ordered by order_index.

**Response:**
```json
[
  {
    "id": 1,
    "symbol": "BTCUSDT", 
    "created_at": "2024-01-01T00:00:00Z",
    "order_index": 0
  }
]
```

### POST /api/crypto-symbols
Add a new crypto symbol.

**Request:**
```json
{
  "symbol": "ETHUSDT"
}
```

### DELETE /api/crypto-symbols/:id
Delete a crypto symbol by ID.

### PUT /api/crypto-symbols/reorder
Update the order of symbols.

**Request:**
```json
{
  "symbols": [
    {"id": 1, "order_index": 0},
    {"id": 2, "order_index": 1}
  ]
}
```

## Free Tier Limits
- 100,000 requests per day
- 10ms CPU time per request
- Global edge network

## Security Benefits
- ✅ Supabase keys hidden server-side
- ✅ CORS properly configured
- ✅ Request validation
- ✅ Error handling
- ✅ Response caching (1 minute for GET requests)

## Usage in Next.js App

Replace direct Supabase calls with Worker API calls:

```typescript
// Before (direct Supabase)
const { data } = await supabase.from('crypto_symbols').select('*');

// After (via Worker)
const response = await fetch('https://crypto-nextjs-api.your-subdomain.workers.dev/api/crypto-symbols');
const data = await response.json();
```