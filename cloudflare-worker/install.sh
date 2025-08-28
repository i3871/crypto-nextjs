#!/bin/bash

echo "Installing Cloudflare Worker dependencies..."

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Install dependencies
npm install

echo "Dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Set your Supabase secrets:"
echo "   npx wrangler secret put SUPABASE_URL"
echo "   npx wrangler secret put SUPABASE_ANON_KEY"
echo ""
echo "2. Deploy the worker:"
echo "   npm run deploy"
echo ""
echo "3. Test the worker:"
echo "   curl https://your-worker.your-subdomain.workers.dev/health"